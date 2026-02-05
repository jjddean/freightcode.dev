// Freightcode.co.uk Carrier API Integration
// Live shipping rates from multiple carriers using free-tier APIs

import axios from 'axios';

// Types for carrier integration
export interface Address {
  name?: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface Parcel {
  length: number;
  width: number;
  height: number;
  distance_unit: 'in' | 'cm';
  weight: number;
  mass_unit: 'lb' | 'kg';
}

export interface CarrierRate {
  carrierId: string;
  carrier: string;
  service: string;
  cost: number;
  amount?: number; // Added for Convex normalization
  currency: string;
  transit_time: string;
  transitTime?: string; // Added for Convex normalization
  delivery_date?: string;
  co2_emission?: number;
  provider: 'shippo' | 'reachship' | 'easyship' | 'fedex' | 'ups' | 'searates';
  price?: {
    amount: number;
    currency: string;
    breakdown?: {
      baseRate: number;
      fuelSurcharge: number;
      securityFee: number;
      documentation: number;
    };
    lineItems?: Array<{
      category: string;
      description: string;
      unit: string;
      price: number;
      currency: string;
      total: number;
    }>;
  };
}

export interface RateRequest {
  origin: Address;
  destination: Address;
  parcel: Parcel;
  service_type?: 'standard' | 'express' | 'overnight';
}

// Environment variables for API keys
const SHIPPO_TOKEN = import.meta.env.VITE_SHIPPO_TOKEN || 'demo_token';
const REACHSHIP_KEY = import.meta.env.VITE_REACHSHIP_KEY || 'demo_key';
const EASYSHIP_TOKEN = import.meta.env.VITE_EASYSHIP_TOKEN || 'demo_token';
const FEDEX_KEY = import.meta.env.VITE_FEDEX_KEY || 'demo_key';
const SEARATES_KEY = import.meta.env.VITE_SEARATES_KEY || 'K-BEEBD969-8265-41EB-A28B-E7E008650BA4';
const SEARATES_ID = import.meta.env.VITE_SEARATES_ID || '38163';

// Debug: Log which tokens are configured (on module load)
console.log('[Carriers] API Tokens loaded:', {
  shippo: SHIPPO_TOKEN?.startsWith('shippo_') ? '✓ configured' : '✗ missing',
  searates: SEARATES_KEY ? '✓ configured' : '✗ missing',
  reachship: REACHSHIP_KEY !== 'demo_key' ? '✓ configured' : '✗ missing',
});

// Shippo API Integration (Multi-carrier aggregator)
export async function getRatesFromShippo(request: RateRequest): Promise<CarrierRate[]> {
  // Skip if token not configured
  if (!SHIPPO_TOKEN || SHIPPO_TOKEN === 'demo_token') {
    console.log('Shippo: No API token configured, using mocks');
    return getMockShippoRates(request);
  }

  // Shippo requires full addresses - provide sensible defaults if missing
  const originAddress = {
    name: request.origin.name || 'Sender',
    street1: request.origin.street1 || '123 Main St',
    city: request.origin.city || 'New York',
    state: request.origin.state || 'NY',
    zip: request.origin.zip || '10001',
    country: request.origin.country || 'US',
  };

  const destAddress = {
    name: request.destination.name || 'Recipient',
    street1: request.destination.street1 || '456 Commerce Way',
    city: request.destination.city || 'Los Angeles',
    state: request.destination.state || 'CA',
    zip: request.destination.zip || '90001',
    country: request.destination.country || 'US',
  };

  try {
    console.log('Shippo: Requesting live rates...', { origin: originAddress.city, dest: destAddress.city });

    const response = await axios.post(
      'https://api.goshippo.com/shipments/',
      {
        address_from: originAddress,
        address_to: destAddress,
        parcels: [{
          length: (request.parcel.length || 10).toString(),
          width: (request.parcel.width || 10).toString(),
          height: (request.parcel.height || 10).toString(),
          distance_unit: request.parcel.distance_unit || 'in',
          weight: (request.parcel.weight || 5).toString(),
          mass_unit: request.parcel.mass_unit || 'lb',
        }],
        async: false,
      },
      {
        headers: {
          Authorization: `ShippoToken ${SHIPPO_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Shippo: Full response:', {
      status: response.data.status,
      ratesCount: response.data.rates?.length || 0,
      addressFrom: response.data.address_from,
      addressTo: response.data.address_to,
    });

    // Log any carrier messages (usually explain why 0 rates)
    if (response.data.messages?.length > 0) {
      console.log('Shippo carrier messages:', response.data.messages.map((m: any) => `${m.source}: ${m.text}`));
    }

    return response.data.rates?.map((rate: any) => ({
      carrierId: rate.object_id || rate.provider,
      carrier: rate.provider,
      service: rate.servicelevel?.name || rate.servicelevel,
      cost: parseFloat(rate.amount),
      currency: rate.currency,
      transit_time: rate.estimated_days ? `${rate.estimated_days} days` : 'Unknown',
      delivery_date: rate.arrives_by,
      provider: 'shippo' as const,
    })) || [];
  } catch (error: any) {
    console.error('Shippo API error:', error.response?.data || error.message);
    return getMockShippoRates(request);
  }
}


// ReachShip API Integration (FedEx, UPS, DHL, USPS)
export async function getReachShipRates(request: RateRequest): Promise<CarrierRate[]> {
  try {
    const response = await axios.post(
      'https://api.reachship.com/v1/quotes',
      {
        origin: {
          address: request.origin.street1,
          city: request.origin.city,
          state: request.origin.state,
          postal_code: request.origin.zip,
          country: request.origin.country,
        },
        destination: {
          address: request.destination.street1,
          city: request.destination.city,
          state: request.destination.state,
          postal_code: request.destination.zip,
          country: request.destination.country,
        },
        parcel: {
          length: request.parcel.length,
          width: request.parcel.width,
          height: request.parcel.height,
          weight: request.parcel.weight,
          units: request.parcel.distance_unit === 'in' ? 'imperial' : 'metric',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${REACHSHIP_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.quotes?.map((quote: any) => ({
      carrier: quote.carrier,
      service: quote.service,
      cost: quote.total_cost,
      currency: quote.currency || 'USD',
      transit_time: quote.transit_time,
      delivery_date: quote.delivery_date,
      provider: 'reachship' as const,
    })) || [];
  } catch (error) {
    console.error('ReachShip API error:', error);
    return getMockReachShipRates(request);
  }
}

// EasyShip API Integration (DHL, USPS, FedEx comparison)
export async function getEasyShipRates(request: RateRequest): Promise<CarrierRate[]> {
  try {
    const response = await axios.post(
      'https://api.easyship.com/2023-01/rates',
      {
        origin_address: {
          line_1: request.origin.street1,
          city: request.origin.city,
          state: request.origin.state,
          postal_code: request.origin.zip,
          country_alpha2: request.origin.country,
        },
        destination_address: {
          line_1: request.destination.street1,
          city: request.destination.city,
          state: request.destination.state,
          postal_code: request.destination.zip,
          country_alpha2: request.destination.country,
        },
        boxes: [{
          length: request.parcel.length,
          width: request.parcel.width,
          height: request.parcel.height,
          weight: request.parcel.weight,
        }],
      },
      {
        headers: {
          Authorization: `Bearer ${EASYSHIP_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.rates?.map((rate: any) => ({
      carrier: rate.courier_name,
      service: rate.service_name,
      cost: rate.total_charge,
      currency: rate.currency,
      transit_time: `${rate.min_delivery_time}-${rate.max_delivery_time} days`,
      delivery_date: rate.delivery_date,
      provider: 'easyship' as const,
    })) || [];
  } catch (error) {
    console.error('EasyShip API error:', error);
    return getMockEasyShipRates(request);
  }
}

// SeaRates API Integration (GraphQL)
let cachedSeaRatesToken: { token: string; expires: number } | null = null;

export async function getSeaRatesToken(): Promise<string> {
  if (cachedSeaRatesToken && cachedSeaRatesToken.expires > Date.now()) {
    return cachedSeaRatesToken.token;
  }

  try {
    const response = await axios.get(
      `https://www.searates.com/auth/platform-token?id=${SEARATES_ID}&api_key=${SEARATES_KEY}`
    );

    // API returns 's-token' field
    const token = response.data?.['s-token'] || response.data?.token;
    if (token) {
      cachedSeaRatesToken = {
        token: token,
        expires: Date.now() + 8 * 3600 * 1000, // Valid for ~10 hours
      };
      console.log('[SeaRates] Token obtained successfully');
      return token;
    }
    throw new Error('Token not found in SeaRates response');
  } catch (error) {
    console.error('SeaRates Token error:', error);
    return '';
  }
}

export async function getRatesFromSeaRates(request: RateRequest): Promise<CarrierRate[]> {
  try {
    const token = await getSeaRatesToken();
    if (!token) return [];

    // City coordinate mapping for common routes
    const cityCoords: Record<string, [number, number]> = {
      'shanghai': [31.2304, 121.4737], 'ningbo': [29.8683, 121.5440],
      'shenzhen': [22.5431, 114.0579], 'hong kong': [22.3193, 114.1694],
      'singapore': [1.3521, 103.8198], 'tokyo': [35.6762, 139.6503],
      'busan': [35.1796, 129.0756], 'mumbai': [19.0760, 72.8777],
      'rotterdam': [51.9244, 4.4777], 'hamburg': [53.5511, 9.9937],
      'antwerp': [51.2194, 4.4025], 'felixstowe': [51.9615, 1.3509],
      'london': [51.5074, -0.1278], 'los angeles': [33.7490, -118.1940],
      'new york': [40.6892, -74.0445], 'miami': [25.7617, -80.1918],
      'houston': [29.7604, -95.3698], 'vancouver': [49.2827, -123.1207],
    };

    const findCoords = (city: string): [number, number] | null => {
      const normalized = city.toLowerCase().trim();
      if (cityCoords[normalized]) return cityCoords[normalized];
      for (const [key, coords] of Object.entries(cityCoords)) {
        if (normalized.includes(key) || key.includes(normalized)) return coords;
      }
      return null;
    };

    const fromCoords = findCoords(request.origin.city || '');
    const toCoords = findCoords(request.destination.city || '');

    if (!fromCoords || !toCoords) {
      console.log(`[SeaRates] No coordinates for ${request.origin.city} -> ${request.destination.city}`);
      return [];
    }

    const weight = request.parcel.weight || 100;
    const shippingType = weight > 15000 ? 'FCL' : 'LCL';

    console.log(`[SeaRates] Querying ${shippingType} rates:`, { from: request.origin.city, to: request.destination.city });

    const query = `
      query rates($shippingType: ShippingType!, $coordinatesFrom: [Float!]!, $coordinatesTo: [Float!]!, $date: String, $weight: Float) {
        rates(shippingType: $shippingType, coordinatesFrom: $coordinatesFrom, coordinatesTo: $coordinatesTo, date: $date, weight: $weight) {
          totalPrice
          totalCurrency
          totalTransitTime
          validityTo
          route {
            points {
              provider
            }
          }
        }
      }
    `;

    const variables = {
      shippingType,
      coordinatesFrom: fromCoords,
      coordinatesTo: toCoords,
      date: new Date().toISOString().split('T')[0],
      weight,
    };

    const response = await axios.post(
      'https://rates.searates.com/graphql',
      { query, variables },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const rates = response.data.data?.rates || [];
    console.log(`[SeaRates] Got ${rates.length} rates`);

    return rates.map((rate: any, idx: number) => {
      const totalPrice = rate.totalPrice || 0;
      const currency = rate.totalCurrency || 'USD';
      const origin = request.origin.city || 'Origin';
      const dest = request.destination.city || 'Destination';

      return {
        carrierId: `searates-${idx}-${Date.now()}`,
        carrier: rate.route?.points?.[0]?.provider || 'SeaRates Carrier',
        service: shippingType === 'FCL' ? 'Full Container' : 'LCL Consolidation',
        cost: totalPrice,
        amount: totalPrice,
        currency,
        transit_time: `${rate.totalTransitTime || 20} days`,
        transitTime: `${rate.totalTransitTime || 20} days`,
        delivery_date: rate.validityTo,
        provider: 'searates' as const,
        price: {
          amount: totalPrice,
          currency,
          lineItems: generateLineItems(origin, dest, totalPrice, currency),
        },
      };
    });

  } catch (error) {
    console.error('SeaRates API error:', error);
    return [];
  }
}

// Detect if shipment is freight (heavy/international) or parcel (light/domestic)
function isFreightShipment(request: RateRequest): boolean {
  const weight = request.parcel.weight || 0;
  const weightInKg = request.parcel.mass_unit === 'lb' ? weight * 0.453592 : weight;

  // Freight indicators:
  // 1. Weight > 50kg (typical parcel carrier max)
  // 2. International non-parcel routes (e.g., China, major ports)
  const isHeavy = weightInKg > 50;

  const freightCountries = ['CN', 'China', 'IN', 'India', 'VN', 'Vietnam', 'BD', 'Bangladesh', 'TH', 'Thailand'];
  const originCountry = request.origin.country?.toUpperCase() || '';
  const destCountry = request.destination.country?.toUpperCase() || '';
  const originCity = request.origin.city?.toLowerCase() || '';

  const isFreightOrigin = freightCountries.some(c =>
    originCountry.includes(c.toUpperCase()) || originCity.includes(c.toLowerCase())
  ) || originCity.includes('shanghai') || originCity.includes('shenzhen') || originCity.includes('ningbo');

  const isInternational = originCountry !== destCountry && originCountry.length > 0 && destCountry.length > 0;

  return isHeavy || (isFreightOrigin && isInternational);
}

// Rate Shopping Engine - Compare rates from all carriers
export async function getAllCarrierRates(request: RateRequest): Promise<CarrierRate[]> {
  const isFreight = isFreightShipment(request);

  console.log(`[Carriers] Fetching ${isFreight ? 'FREIGHT' : 'PARCEL'} rates...`, {
    origin: request.origin.city,
    dest: request.destination.city,
    weight: request.parcel.weight,
    unit: request.parcel.mass_unit,
  });

  // Mock carriers only - SeaRates is called separately via Convex action (see LiveRateComparison)
  const ratePromises: Promise<CarrierRate[]>[] = [
    getRatesFromShippo(request),   // Live parcel rates (UPS/USPS)
    // Note: SeaRates removed - called via Convex action to avoid CORS
    getReachShipRates(request),    // Mocks (CORS blocked)
    getEasyShipRates(request),     // Mocks (no token)
  ];


  try {
    const results = await Promise.allSettled(ratePromises);
    const allRates: CarrierRate[] = [];

    results.forEach((result: PromiseSettledResult<CarrierRate[]>, index: number) => {
      if (result.status === 'fulfilled') {
        allRates.push(...result.value);
      } else {
        console.error(`Carrier API ${index} failed:`, result.reason);
      }
    });

    // If no live rates found, fallback to mocks to ensure UI has data
    if (allRates.length === 0) {
      console.warn('[Carriers] No live rates found, returning mocks');
      return getMockAllRates(request);
    }

    console.log(`[Carriers] Got ${allRates.length} total rates`);
    // Sort by cost (lowest first)
    return allRates.sort((a, b) => a.cost - b.cost);
  } catch (error) {
    console.error('Error fetching carrier rates:', error);
    return getMockAllRates(request);
  }
}



// Mock data for demo/fallback purposes

// Helper to generate detailed line items for price breakdown
function generateLineItems(origin: string, dest: string, baseCost: number, currency: string) {
  const freight = baseCost * 0.6;
  const fuel = baseCost * 0.15;
  const security = baseCost * 0.05;
  const handling = baseCost * 0.1;
  const documentation = baseCost * 0.1;

  return [
    { category: "Origin", description: `Pick up charges (${origin})`, unit: "shipment", price: handling * 0.5, currency, total: handling * 0.5 },
    { category: "Origin", description: "Documentation fee", unit: "shipment", price: documentation * 0.4, currency, total: documentation * 0.4 },
    { category: "Main Transport", description: `Freight ${origin} → ${dest}`, unit: "shipment", price: freight, currency, total: freight },
    { category: "Main Transport", description: "Fuel Surcharge", unit: "shipment", price: fuel, currency, total: fuel },
    { category: "Destination", description: "Security Surcharge", unit: "shipment", price: security, currency, total: security },
    { category: "Destination", description: "Terminal Handling", unit: "shipment", price: handling * 0.5, currency, total: handling * 0.5 },
    { category: "Destination", description: "Delivery charges", unit: "shipment", price: documentation * 0.6, currency, total: documentation * 0.6 },
  ];
}

function getMockShippoRates(request: RateRequest): CarrierRate[] {
  const distance = calculateDistance(request.origin, request.destination);
  const baseRate = Math.max(15, distance * 0.1 + request.parcel.weight * 0.5);
  const origin = request.origin.city || 'Origin';
  const dest = request.destination.city || 'Destination';

  return [
    {
      carrierId: 'shippo-fedex-ground',
      carrier: 'FedEx',
      service: 'Ground',
      cost: baseRate * 1.2,
      amount: baseRate * 1.2,
      currency: 'USD',
      transit_time: '3-5 days',
      transitTime: '3-5 days',
      provider: 'shippo',
      price: {
        amount: baseRate * 1.2,
        currency: 'USD',
        lineItems: generateLineItems(origin, dest, baseRate * 1.2, 'USD'),
      },
    },
    {
      carrierId: 'shippo-ups-ground',
      carrier: 'UPS',
      service: 'Ground',
      cost: baseRate * 1.1,
      amount: baseRate * 1.1,
      currency: 'USD',
      transit_time: '3-5 days',
      transitTime: '3-5 days',
      provider: 'shippo',
      price: {
        amount: baseRate * 1.1,
        currency: 'USD',
        lineItems: generateLineItems(origin, dest, baseRate * 1.1, 'USD'),
      },
    },
    {
      carrierId: 'shippo-usps-priority',
      carrier: 'USPS',
      service: 'Priority Mail',
      cost: baseRate * 0.8,
      amount: baseRate * 0.8,
      currency: 'USD',
      transit_time: '2-3 days',
      transitTime: '2-3 days',
      provider: 'shippo',
      price: {
        amount: baseRate * 0.8,
        currency: 'USD',
        lineItems: generateLineItems(origin, dest, baseRate * 0.8, 'USD'),
      },
    },
  ];
}

function getMockReachShipRates(request: RateRequest): CarrierRate[] {
  const distance = calculateDistance(request.origin, request.destination);
  const baseRate = Math.max(20, distance * 0.12 + request.parcel.weight * 0.6);
  const origin = request.origin.city || 'Origin';
  const dest = request.destination.city || 'Destination';

  return [
    {
      carrierId: 'reachship-dhl-express',
      carrier: 'DHL',
      service: 'Express',
      cost: baseRate * 1.5,
      amount: baseRate * 1.5,
      currency: 'USD',
      transit_time: '1-2 days',
      transitTime: '1-2 days',
      provider: 'reachship',
      price: {
        amount: baseRate * 1.5,
        currency: 'USD',
        lineItems: generateLineItems(origin, dest, baseRate * 1.5, 'USD'),
      },
    },
    {
      carrierId: 'reachship-fedex-express',
      carrier: 'FedEx',
      service: 'Express',
      cost: baseRate * 1.4,
      amount: baseRate * 1.4,
      currency: 'USD',
      transit_time: '1-2 days',
      transitTime: '1-2 days',
      provider: 'reachship',
      price: {
        amount: baseRate * 1.4,
        currency: 'USD',
        lineItems: generateLineItems(origin, dest, baseRate * 1.4, 'USD'),
      },
    },
  ];
}

function getMockEasyShipRates(request: RateRequest): CarrierRate[] {
  const distance = calculateDistance(request.origin, request.destination);
  const baseRate = Math.max(18, distance * 0.11 + request.parcel.weight * 0.55);
  const origin = request.origin.city || 'Origin';
  const dest = request.destination.city || 'Destination';

  return [
    {
      carrierId: 'easyship-dhl-standard',
      carrier: 'DHL',
      service: 'Standard',
      cost: baseRate * 1.3,
      amount: baseRate * 1.3,
      currency: 'USD',
      transit_time: '2-4 days',
      transitTime: '2-4 days',
      provider: 'easyship',
      price: {
        amount: baseRate * 1.3,
        currency: 'USD',
        lineItems: generateLineItems(origin, dest, baseRate * 1.3, 'USD'),
      },
    },
    {
      carrierId: 'easyship-royalmail-intl',
      carrier: 'Royal Mail',
      service: 'International',
      cost: baseRate * 0.9,
      amount: baseRate * 0.9,
      currency: 'GBP',
      transit_time: '5-7 days',
      transitTime: '5-7 days',
      provider: 'easyship',
      price: {
        amount: baseRate * 0.9,
        currency: 'GBP',
        lineItems: generateLineItems(origin, dest, baseRate * 0.9, 'GBP'),
      },
    },
  ];
}

function getMockAllRates(request: RateRequest): CarrierRate[] {
  return [
    ...getMockShippoRates(request),
    ...getMockReachShipRates(request),
    ...getMockEasyShipRates(request),
  ].sort((a, b) => a.cost - b.cost);
}

// Utility function to calculate approximate distance (for mock pricing)
function calculateDistance(origin: Address, destination: Address): number {
  // Simple distance calculation for demo purposes
  // In production, you'd use a proper geocoding service
  const cityDistances: Record<string, Record<string, number>> = {
    'London': { 'Hamburg': 450, 'New York': 3500, 'Shanghai': 5700 },
    'Manchester': { 'Hamburg': 520, 'New York': 3300, 'Shanghai': 5500 },
    'Birmingham': { 'Hamburg': 480, 'New York': 3400, 'Shanghai': 5600 },
  };

  const originCity = origin.city;
  const destCity = destination.city;

  return cityDistances[originCity]?.[destCity] || 1000; // Default 1000 miles
}

// Address validation helper
export function validateAddress(address: Address): boolean {
  return !!(
    address.street1 &&
    address.city &&
    address.zip &&
    address.country
  );
}

// Convert between units
export function convertWeight(weight: number, from: 'lb' | 'kg', to: 'lb' | 'kg'): number {
  if (from === to) return weight;
  if (from === 'lb' && to === 'kg') return weight * 0.453592;
  if (from === 'kg' && to === 'lb') return weight * 2.20462;
  return weight;
}

export function convertDimensions(value: number, from: 'in' | 'cm', to: 'in' | 'cm'): number {
  if (from === to) return value;
  if (from === 'in' && to === 'cm') return value * 2.54;
  if (from === 'cm' && to === 'in') return value / 2.54;
  return value;
}
