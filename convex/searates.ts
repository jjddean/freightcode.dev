"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

// SeaRates API Configuration
const SEARATES_PLATFORM_ID = process.env.SEARATES_PLATFORM_ID || "38163";
const SEARATES_API_KEY = process.env.SEARATES_API_KEY || "K-BEEBD969-8265-41EB-A28B-E7E008650BA4";
const SEARATES_TOKEN_URL = "https://www.searates.com/auth/platform-token";
const SEARATES_GRAPHQL_URL = "https://rates.searates.com/graphql";

// Token cache (in-memory for now)
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

// Coordinate mapping for major ports/cities
const CITY_COORDINATES: Record<string, [number, number]> = {
    // China
    "shanghai": [31.2304, 121.4737],
    "ningbo": [29.8683, 121.5440],
    "shenzhen": [22.5431, 114.0579],
    "guangzhou": [23.1291, 113.2644],
    "hong kong": [22.3193, 114.1694],
    "beijing": [39.9042, 116.4074],

    // Asia
    "singapore": [1.3521, 103.8198],
    "tokyo": [35.6762, 139.6503],
    "busan": [35.1796, 129.0756],
    "mumbai": [19.0760, 72.8777],
    "dubai": [25.2048, 55.2708],

    // Europe
    "rotterdam": [51.9244, 4.4777],
    "antwerp": [51.2194, 4.4025],
    "hamburg": [53.5511, 9.9937],
    "felixstowe": [51.9615, 1.3509],
    "london": [51.5074, -0.1278],
    "le havre": [49.4944, 0.1079],
    "valencia": [39.4699, -0.3763],
    "barcelona": [41.3851, 2.1734],
    "genoa": [44.4056, 8.9463],

    // North America
    "los angeles": [33.7490, -118.1940],
    "long beach": [33.7701, -118.1937],
    "new york": [40.6892, -74.0445],
    "savannah": [32.0809, -81.0912],
    "houston": [29.7604, -95.3698],
    "seattle": [47.6062, -122.3321],
    "charleston": [32.7765, -79.9311],
    "miami": [25.7617, -80.1918],
    "vancouver": [49.2827, -123.1207],
    "montreal": [45.5017, -73.5673],

    // South America
    "santos": [-23.9608, -46.3336],
    "buenos aires": [-34.6037, -58.3816],

    // Oceania
    "sydney": [-33.8688, 151.2093],
    "melbourne": [-37.8136, 144.9631],
    "auckland": [-36.8485, 174.7633],
};

// Get coordinates for a city name
export function getCityCoordinates(city: string): [number, number] | null {
    const normalized = city.toLowerCase().trim();

    // Direct match
    if (CITY_COORDINATES[normalized]) {
        return CITY_COORDINATES[normalized];
    }

    // Partial match
    for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
        if (normalized.includes(key) || key.includes(normalized)) {
            return coords;
        }
    }

    return null;
}

// Get Bearer token from SeaRates
async function getSeaRatesToken(): Promise<string> {
    const now = Date.now();

    // Return cached token if still valid (with 5 min buffer)
    if (cachedToken && tokenExpiry > now + 300000) {
        return cachedToken;
    }

    const url = `${SEARATES_TOKEN_URL}?id=${SEARATES_PLATFORM_ID}&api_key=${SEARATES_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`SeaRates token request failed: ${response.status}`);
    }

    const data = await response.json();
    cachedToken = data["s-token"];

    // Token typically valid for ~10 hours, set expiry to 9 hours from now
    tokenExpiry = now + 9 * 60 * 60 * 1000;

    return cachedToken!;
}

// GraphQL query for freight rates - Updated to match current SeaRates API schema
const RATES_QUERY = `
query GetRates(
  $shippingType: ShippingTypes!
  $coordinatesFrom: [Float!]!
  $coordinatesTo: [Float!]!
  $weight: Float
  $volume: Float
) {
  rates(
    shippingType: $shippingType
    coordinatesFrom: $coordinatesFrom
    coordinatesTo: $coordinatesTo
    weight: $weight
    volume: $volume
  ) {
    shipmentId
    totalPrice
    totalCurrency
    totalTransitTime
    validityFrom
    validityTo
    queryShippingType
    points {
      location {
        name
        country
      }
      shippingType
      provider
      pointTariff {
        name
        abbr
        price
        currency
      }
      routeTariff {
        name
        abbr
        price
        currency
      }
      transitTime {
        rate
        route
      }
    }
  }
}
`;

// Types matching the actual SeaRates API response
interface SeaRatesTariff {
    name: string;
    abbr: string;
    price: number;
    currency: string;
}

interface SeaRatesPoint {
    location: { name: string; country: string };
    shippingType: string;
    provider: string;
    pointTariff: SeaRatesTariff[];
    routeTariff: SeaRatesTariff[];
    transitTime: { rate: number; route: number };
}

interface SeaRatesRate {
    shipmentId: string;
    totalPrice: number;
    totalCurrency: string;
    totalTransitTime: number;
    validityFrom: string;
    validityTo: string;
    queryShippingType: string;
    points: SeaRatesPoint[];
}

// Main action to get SeaRates quotes
export const getSeaRatesQuotes = action({
    args: {
        origin: v.string(),
        destination: v.string(),
        shippingType: v.string(), // "FCL" or "LCL"
        container: v.optional(v.string()), // "ST20", "ST40", "HC40" for FCL
        weight: v.optional(v.number()), // kg for LCL
    },
    handler: async (ctx, args): Promise<any[]> => {
        try {
            // Get coordinates
            const fromCoords = getCityCoordinates(args.origin);
            const toCoords = getCityCoordinates(args.destination);

            if (!fromCoords || !toCoords) {
                console.warn(`SeaRates: Could not find coordinates for ${args.origin} -> ${args.destination}`);
                return [];
            }

            // Get token
            const token = await getSeaRatesToken();

            // Prepare variables - remove date/container, use weight/volume
            const variables: any = {
                shippingType: args.shippingType.toUpperCase() === "AIR" ? "AIR" :
                    args.shippingType.toUpperCase() === "LCL" ? "LCL" : "FCL",
                coordinatesFrom: fromCoords,
                coordinatesTo: toCoords,
            };

            // Add weight for LCL/AIR
            if (args.weight) {
                variables.weight = args.weight;
            }

            console.log(`SeaRates: Querying ${variables.shippingType} rates from ${args.origin} to ${args.destination}`);

            // Make GraphQL request
            const response = await fetch(SEARATES_GRAPHQL_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    query: RATES_QUERY,
                    variables,
                }),
            });

            if (!response.ok) {
                console.error(`SeaRates API error: ${response.status}`);
                return [];
            }

            const result = await response.json();

            if (result.errors) {
                console.error("SeaRates GraphQL errors:", result.errors);
                return [];
            }

            const rates: SeaRatesRate[] = result.data?.rates || [];
            console.log(`SeaRates: Got ${rates.length} rates`);

            // Transform to our quote format
            return rates.map((rate, idx) => {
                // Extract carrier from first point with a provider
                const carrierPoint = rate.points?.find(p => p.provider) || rate.points?.[0];
                const carrier = carrierPoint?.provider || "SeaRates Carrier";

                // Build lineItems from all tariffs
                const lineItems: { category: string; description: string; unit: string; price: number; currency: string; total: number }[] = [];

                for (const point of (rate.points || [])) {
                    // Add point tariffs (e.g., terminal handling)
                    for (const tariff of (point.pointTariff || [])) {
                        lineItems.push({
                            category: "Terminal",
                            description: tariff.name || tariff.abbr,
                            unit: "shipment",
                            price: tariff.price,
                            currency: tariff.currency || rate.totalCurrency || "USD",
                            total: tariff.price,
                        });
                    }
                    // Add route tariffs (e.g., ocean freight)
                    for (const tariff of (point.routeTariff || [])) {
                        lineItems.push({
                            category: "Freight",
                            description: tariff.name || tariff.abbr,
                            unit: "shipment",
                            price: tariff.price,
                            currency: tariff.currency || rate.totalCurrency || "USD",
                            total: tariff.price,
                        });
                    }
                }

                // If no tariff details, create fallback breakdown
                if (lineItems.length === 0) {
                    const totalPrice = rate.totalPrice;
                    const currency = rate.totalCurrency || "USD";
                    lineItems.push(
                        { category: "Freight", description: `Ocean Freight (${args.origin} → ${args.destination})`, unit: "shipment", price: totalPrice * 0.65, currency, total: totalPrice * 0.65 },
                        { category: "Surcharges", description: "Bunker Adjustment Factor (BAF)", unit: "shipment", price: totalPrice * 0.15, currency, total: totalPrice * 0.15 },
                        { category: "Terminal", description: "Terminal Handling Origin", unit: "shipment", price: totalPrice * 0.08, currency, total: totalPrice * 0.08 },
                        { category: "Terminal", description: "Terminal Handling Destination", unit: "shipment", price: totalPrice * 0.07, currency, total: totalPrice * 0.07 },
                        { category: "Documentation", description: "Documentation Fee", unit: "shipment", price: totalPrice * 0.05, currency, total: totalPrice * 0.05 },
                    );
                }

                return {
                    carrierId: `searates-${carrier.replace(/\s+/g, '-').toLowerCase()}-${idx}`,
                    carrierName: carrier,
                    serviceType: rate.queryShippingType || (args.shippingType.toUpperCase() === "AIR" ? "Air Freight" : "Ocean Freight"),
                    transitTime: `${rate.totalTransitTime} days`,
                    price: {
                        amount: rate.totalPrice,
                        currency: rate.totalCurrency || "USD",
                        breakdown: {
                            baseRate: rate.totalPrice,
                            fuelSurcharge: 0,
                            securityFee: 0,
                            documentation: 0,
                        },
                        lineItems,
                    },
                    validUntil: rate.validityTo || new Date(Date.now() + 7 * 86400000).toISOString(),
                    source: "searates",
                };
            });

        } catch (error) {
            console.error("SeaRates API error:", error);
            return [];
        }
    },
});

// NOTE: The frontend passes rates directly to the createQuote mutation via the
// carriers.ts service. No separate action wrapper is needed here.
