import { query, action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";

// High-risk zones data
const HIGH_RISK_ZONES = {
    // OFAC Primary Sanctions
    sanctions: ['RU', 'IR', 'KP', 'SY', 'CU', 'VE', 'BY'],
    // Active Conflict Zones
    conflict: ['UA', 'YE', 'SD', 'MM', 'ET', 'SO', 'AF', 'LY'],
    // High-Risk Maritime Areas
    maritime: [
        'Red Sea', 'Gulf of Aden', 'Suez Canal', 'Strait of Hormuz',
        'Gulf of Guinea', 'Malacca Strait', 'South China Sea'
    ],
    // Piracy Risk Areas
    piracy: ['Somalia', 'Nigeria', 'Indonesia', 'Philippines']
};

// Country code to name mapping for common routes
const COUNTRY_NAMES: Record<string, string> = {
    'GB': 'United Kingdom', 'US': 'United States', 'CN': 'China',
    'DE': 'Germany', 'FR': 'France', 'IT': 'Italy', 'ES': 'Spain',
    'NL': 'Netherlands', 'BE': 'Belgium', 'SA': 'Saudi Arabia',
    'AE': 'United Arab Emirates', 'IN': 'India', 'JP': 'Japan',
    'KR': 'South Korea', 'SG': 'Singapore', 'HK': 'Hong Kong',
    'AU': 'Australia', 'BR': 'Brazil', 'MX': 'Mexico', 'TR': 'Turkey',
    'RU': 'Russia', 'IR': 'Iran', 'KP': 'North Korea', 'SY': 'Syria',
    'CU': 'Cuba', 'VE': 'Venezuela', 'BY': 'Belarus', 'UA': 'Ukraine',
    'YE': 'Yemen', 'SD': 'Sudan', 'MM': 'Myanmar', 'ET': 'Ethiopia'
};

// Calculate static zone-based risk
function calculateZoneRisk(originCountry: string, destCountry: string, transitPoints?: string[]): {
    score: number;
    factors: string[];
} {
    let score = 0;
    const factors: string[] = [];

    // Check sanctions
    if (HIGH_RISK_ZONES.sanctions.includes(originCountry)) {
        score += 40;
        factors.push(`Origin (${COUNTRY_NAMES[originCountry] || originCountry}) is under sanctions`);
    }
    if (HIGH_RISK_ZONES.sanctions.includes(destCountry)) {
        score += 40;
        factors.push(`Destination (${COUNTRY_NAMES[destCountry] || destCountry}) is under sanctions`);
    }

    // Check conflict zones
    if (HIGH_RISK_ZONES.conflict.includes(originCountry)) {
        score += 25;
        factors.push(`Origin (${COUNTRY_NAMES[originCountry] || originCountry}) is in active conflict zone`);
    }
    if (HIGH_RISK_ZONES.conflict.includes(destCountry)) {
        score += 25;
        factors.push(`Destination (${COUNTRY_NAMES[destCountry] || destCountry}) is in active conflict zone`);
    }

    // Check transit points for maritime risks
    if (transitPoints) {
        transitPoints.forEach(point => {
            const matchedZone = HIGH_RISK_ZONES.maritime.find(zone =>
                point.toLowerCase().includes(zone.toLowerCase())
            );
            if (matchedZone) {
                score += 15;
                factors.push(`Transit via ${matchedZone} - elevated maritime risk`);
            }
        });
    }

    return { score: Math.min(score, 100), factors };
}

// Internal action to check OpenSanctions (free API)
export const checkSanctions = internalAction({
    args: {
        name: v.string(),
        entityType: v.optional(v.string())
    },
    handler: async (ctx, { name, entityType }) => {
        try {
            // OpenSanctions free API - no auth required for basic search
            const schema = entityType === 'vessel' ? 'Vessel' : 'LegalEntity';
            const encodedName = encodeURIComponent(name);

            const response = await fetch(
                `https://api.opensanctions.org/match/default?schema=${schema}&properties.name=${encodedName}`,
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                console.warn('OpenSanctions API error:', response.status);
                return { matched: false, score: 0, entities: [] };
            }

            const data = await response.json();
            const results = data.results || [];

            if (results.length === 0) {
                return { matched: false, score: 0, entities: [] };
            }

            // Filter for high-confidence matches (score > 0.7)
            const highConfidenceMatches = results.filter((r: any) => r.score > 0.7);

            return {
                matched: highConfidenceMatches.length > 0,
                score: highConfidenceMatches.length > 0 ? Math.round(highConfidenceMatches[0].score * 100) : 0,
                entities: highConfidenceMatches.slice(0, 3).map((m: any) => ({
                    name: m.match?.properties?.name?.[0] || name,
                    type: m.match?.schema || 'Unknown',
                    source: m.match?.datasets?.join(', ') || 'OpenSanctions',
                    score: m.score
                }))
            };
        } catch (error) {
            console.error('Sanctions check failed:', error);
            return { matched: false, score: 0, entities: [] };
        }
    }
});

// Internal action to get weather risk
export const getWeatherRisk = internalAction({
    args: {
        lat: v.number(),
        lon: v.number()
    },
    handler: async (ctx, { lat, lon }) => {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) {
            console.warn('OPENWEATHER_API_KEY not configured');
            return { risk: 0, conditions: 'Unknown', details: null };
        }

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
            );

            if (!response.ok) {
                console.error('OpenWeather API error:', response.status);
                return { risk: 0, conditions: 'Unknown', details: null };
            }

            const data = await response.json();
            let risk = 0;
            const factors: string[] = [];

            // Assess weather conditions
            const main = data.weather?.[0]?.main || '';
            const description = data.weather?.[0]?.description || '';
            const windSpeed = data.wind?.speed || 0;
            const visibility = data.visibility || 10000;

            if (main === 'Thunderstorm') {
                risk += 30;
                factors.push('Thunderstorm activity');
            }
            if (main === 'Snow' || main === 'Blizzard') {
                risk += 20;
                factors.push('Snow/winter conditions');
            }
            if (main === 'Rain' && description.includes('heavy')) {
                risk += 15;
                factors.push('Heavy rainfall');
            }
            if (windSpeed > 20) {
                risk += 20;
                factors.push(`Strong winds (${windSpeed} m/s)`);
            }
            if (visibility < 1000) {
                risk += 15;
                factors.push('Low visibility');
            }

            return {
                risk: Math.min(risk, 50), // Cap weather risk at 50
                conditions: main,
                details: {
                    description,
                    windSpeed,
                    visibility,
                    temp: data.main?.temp,
                    factors
                }
            };
        } catch (error) {
            console.error('Weather check failed:', error);
            return { risk: 0, conditions: 'Unknown', details: null };
        }
    }
});

// Main GeoRisk assessment action
export const assessRouteRisk: any = action({
    args: {
        origin: v.string(),
        destination: v.string(),
        originCountry: v.string(),
        destCountry: v.string(),
        originCoords: v.optional(v.object({ lat: v.number(), lon: v.number() })),
        destCoords: v.optional(v.object({ lat: v.number(), lon: v.number() })),
        transitPoints: v.optional(v.array(v.string())),
        parties: v.optional(v.array(v.object({
            name: v.string(),
            type: v.optional(v.string())
        })))
    },
    handler: async (ctx, args): Promise<any> => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        // Check subscription tier
        const user = await ctx.runQuery(api.users.getUserByExternalId, {
            externalId: identity.subject
        });

        const isPremium = user?.subscriptionTier && user.subscriptionTier !== 'free';

        // 1. Zone-based risk (always available)
        const zoneRisk = calculateZoneRisk(
            args.originCountry,
            args.destCountry,
            args.transitPoints
        );

        // For free tier, return limited assessment
        if (!isPremium) {
            const limitedScore = Math.min(zoneRisk.score, 60); // Cap at 60 for free tier
            return {
                score: limitedScore,
                level: limitedScore > 50 ? 'MEDIUM' : 'LOW',
                advisory: 'Upgrade to Pro for detailed risk analysis including sanctions screening and weather impact.',
                factors: {
                    zone: { score: zoneRisk.score, details: zoneRisk.factors.slice(0, 1) },
                    sanctions: { available: false },
                    weather: { available: false }
                },
                premium: false,
                lastUpdated: Date.now()
            };
        }

        // 2. Sanctions screening (Premium)
        let sanctionsRisk = 0;
        const sanctionsDetails: any[] = [];

        if (args.parties && args.parties.length > 0) {
            for (const party of args.parties) {
                const result = await ctx.runAction(internal.georisk.checkSanctions, {
                    name: party.name,
                    entityType: party.type
                });

                if (result.matched) {
                    sanctionsRisk += 35;
                    sanctionsDetails.push({
                        party: party.name,
                        matched: true,
                        entities: result.entities
                    });
                }
            }
        }

        // 3. Weather risk (Premium)
        let weatherRisk = 0;
        let weatherDetails = null;

        if (args.destCoords) {
            const weather: any = await ctx.runAction(internal.georisk.getWeatherRisk, {
                lat: args.destCoords.lat,
                lon: args.destCoords.lon
            });
            weatherRisk = weather.risk;
            weatherDetails = weather.details;
        }

        // 4. Calculate weighted final score
        const weights = {
            zone: 0.40,
            sanctions: 0.40,
            weather: 0.20
        };

        const finalScore = Math.round(
            zoneRisk.score * weights.zone +
            sanctionsRisk * weights.sanctions +
            weatherRisk * weights.weather
        );

        const cappedScore = Math.min(finalScore, 100);

        // Generate advisory
        let advisory = '';
        if (cappedScore > 70) {
            advisory = 'HIGH RISK: This route has significant risk factors. Consider alternative routing, additional insurance, or enhanced due diligence before proceeding.';
        } else if (cappedScore > 40) {
            advisory = 'MEDIUM RISK: Elevated risk factors detected. Monitor conditions closely and consider contingency plans.';
        } else {
            advisory = 'LOW RISK: Route appears stable. Standard procedures apply.';
        }

        return {
            score: cappedScore,
            level: cappedScore > 70 ? 'HIGH' : cappedScore > 40 ? 'MEDIUM' : 'LOW',
            advisory,
            factors: {
                zone: {
                    score: zoneRisk.score,
                    weight: weights.zone,
                    details: zoneRisk.factors
                },
                sanctions: {
                    score: sanctionsRisk,
                    weight: weights.sanctions,
                    details: sanctionsDetails,
                    available: true
                },
                weather: {
                    score: weatherRisk,
                    weight: weights.weather,
                    details: weatherDetails,
                    available: true
                }
            },
            premium: true,
            lastUpdated: Date.now()
        };
    }
});

// Quick risk check for quotes (lighter weight)
export const quickRiskCheck = action({
    args: {
        originCountry: v.string(),
        destCountry: v.string()
    },
    handler: async (ctx, { originCountry, destCountry }) => {
        const zoneRisk = calculateZoneRisk(originCountry, destCountry);

        return {
            score: zoneRisk.score,
            level: zoneRisk.score > 70 ? 'HIGH' : zoneRisk.score > 40 ? 'MEDIUM' : 'LOW',
            hasRisk: zoneRisk.score > 30,
            factors: zoneRisk.factors.length
        };
    }
});

// Get list of high-risk countries
export const getHighRiskCountries = query({
    args: {},
    handler: async () => {
        return {
            sanctions: HIGH_RISK_ZONES.sanctions.map(code => ({
                code,
                name: COUNTRY_NAMES[code] || code,
                type: 'sanctions'
            })),
            conflict: HIGH_RISK_ZONES.conflict.map(code => ({
                code,
                name: COUNTRY_NAMES[code] || code,
                type: 'conflict'
            })),
            maritime: HIGH_RISK_ZONES.maritime
        };
    }
});
