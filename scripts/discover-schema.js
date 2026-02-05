// Try to discover real Rate fields using minimal __typename queries
import axios from 'axios';

const SEARATES_KEY = 'K-BEEBD969-8265-41EB-A28B-E7E008650BA4';
const SEARATES_ID = '38163';

async function discoverRealSchema() {
    console.log('=== Discovering Real SeaRates Schema ===\n');

    const tokenUrl = `https://www.searates.com/auth/platform-token?id=${SEARATES_ID}&api_key=${SEARATES_KEY}`;
    const tokenRes = await axios.get(tokenUrl);
    const token = tokenRes.data['s-token'];
    console.log('Token ✓\n');

    const graphqlUrl = 'https://rates.searates.com/graphql';

    // Try just __typename first  
    const queries = [
        {
            name: 'Just __typename',
            query: `query { rates(shippingType: LCL, coordinatesFrom: [31.23, 121.47], coordinatesTo: [33.75, -118.19], weight: 100) { __typename } }`
        },
        {
            name: 'With route field',
            query: `query { rates(shippingType: LCL, coordinatesFrom: [31.23, 121.47], coordinatesTo: [33.75, -118.19], weight: 100) { route { __typename } } }`
        },
        {
            name: 'With legs field',
            query: `query { rates(shippingType: LCL, coordinatesFrom: [31.23, 121.47], coordinatesTo: [33.75, -118.19], weight: 100) { legs { __typename } } }`
        },
        {
            name: 'With total field',
            query: `query { rates(shippingType: LCL, coordinatesFrom: [31.23, 121.47], coordinatesTo: [33.75, -118.19], weight: 100) { total } }`
        },
        {
            name: 'With amount field',
            query: `query { rates(shippingType: LCL, coordinatesFrom: [31.23, 121.47], coordinatesTo: [33.75, -118.19], weight: 100) { amount } }`
        },
        {
            name: 'With data field',
            query: `query { rates(shippingType: LCL, coordinatesFrom: [31.23, 121.47], coordinatesTo: [33.75, -118.19], weight: 100) { data { __typename } } }`
        },
        {
            name: 'Try lcl query',
            query: `query { lcl(coordinatesFrom: [31.23, 121.47], coordinatesTo: [33.75, -118.19], weight: 100) { __typename } }`
        },
        {
            name: 'Try quote query',
            query: `query { quote(shippingType: LCL, coordinatesFrom: [31.23, 121.47], coordinatesTo: [33.75, -118.19], weight: 100) { __typename } }`
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

            if (response.data.errors) {
                console.log('  ❌', response.data.errors[0]?.message);
            } else {
                console.log('  ✅ SUCCESS!');
                console.log('  Data:', JSON.stringify(response.data.data, null, 2));
            }
        } catch (error) {
            console.log('  Error:', error.message);
        }
        console.log('');
    }
}

discoverRealSchema();
