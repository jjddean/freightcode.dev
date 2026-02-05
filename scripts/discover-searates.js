// Try minimal queries to discover SeaRates GraphQL structure
import axios from 'axios';

const SEARATES_KEY = 'K-BEEBD969-8265-41EB-A28B-E7E008650BA4';
const SEARATES_ID = '38163';

async function discoverSchema() {
    console.log('=== SeaRates Schema Discovery ===\n');

    const tokenUrl = `https://www.searates.com/auth/platform-token?id=${SEARATES_ID}&api_key=${SEARATES_KEY}`;
    const tokenRes = await axios.get(tokenUrl);
    const token = tokenRes.data['s-token'];
    console.log('Token ✓\n');

    const graphqlUrl = 'https://rates.searates.com/graphql';

    // Try minimal query with __typename to discover structure
    const queries = [
        // Query 1: Try with __typename
        {
            name: 'rates with __typename',
            query: `query { rates(shippingType: LCL, coordinatesFrom: [31.23, 121.47], coordinatesTo: [33.75, -118.19]) { __typename } }`
        },
        // Query 2: Try lcl specifically
        {
            name: 'lcl query',
            query: `query { lcl(coordinatesFrom: [31.23, 121.47], coordinatesTo: [33.75, -118.19], weight: 100) { __typename } }`
        },
        // Query 3: Try fcl
        {
            name: 'fcl query',
            query: `query { fcl(coordinatesFrom: [31.23, 121.47], coordinatesTo: [33.75, -118.19]) { __typename } }`
        },
        // Query 4: Try getQuotes or quotes
        {
            name: 'quotes query',
            query: `query { quotes(from: [31.23, 121.47], to: [33.75, -118.19]) { __typename } }`
        },
        // Query 5: Full introspection
        {
            name: 'full introspection',
            query: `{ __schema { queryType { fields { name } } } }`
        }
    ];

    for (const q of queries) {
        console.log(`Testing: ${q.name}`);
        try {
            const response = await axios.post(graphqlUrl, {
                query: q.query
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('  Result:', JSON.stringify(response.data, null, 2).substring(0, 500));
        } catch (error) {
            console.log('  Error:', error.response?.data?.errors?.[0]?.message || error.message);
        }
        console.log('');
    }
}

discoverSchema();
