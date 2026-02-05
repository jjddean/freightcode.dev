// Test with correct SeaRates parameters based on docs
import axios from 'axios';

const SEARATES_KEY = 'K-BEEBD969-8265-41EB-A28B-E7E008650BA4';
const SEARATES_ID = '38163';

async function testWithDocParams() {
    console.log('=== Testing with Documented Parameters ===\n');

    const tokenUrl = `https://www.searates.com/auth/platform-token?id=${SEARATES_ID}&api_key=${SEARATES_KEY}`;
    const tokenRes = await axios.get(tokenUrl);
    const token = tokenRes.data['s-token'];
    console.log('Token ✓\n');

    const graphqlUrl = 'https://rates.searates.com/graphql';

    // Try FCL with container parameter
    const queries = [
        {
            name: 'FCL with container ST20',
            query: `query { rates(shippingType: FCL, container: ST20, coordinatesFrom: [31.23, 121.47], coordinatesTo: [33.75, -118.19]) { __typename } }`
        },
        {
            name: 'FCL with p2p',
            query: `query { rates(shippingType: FCL, container: ST20, coordinatesFrom: [31.23, 121.47], coordinatesTo: [33.75, -118.19], p2p: true) { __typename } }`
        },
        {
            name: 'LCL with weight and volume',
            query: `query { rates(shippingType: LCL, coordinatesFrom: [31.23, 121.47], coordinatesTo: [33.75, -118.19], weight: 100, volume: 1) { __typename } }`
        },
        {
            name: 'LCL with weightUnit',
            query: `query { rates(shippingType: LCL, coordinatesFrom: [31.23, 121.47], coordinatesTo: [33.75, -118.19], weight: 100, weightUnit: KG, volume: 1, volumeUnit: M3) { __typename } }`
        }
    ];

    for (const q of queries) {
        console.log(`Testing: ${q.name}`);
        try {
            const response = await axios.post(graphqlUrl, { query: q.query }, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });

            if (response.data.errors) {
                console.log('  ❌', response.data.errors[0]?.message);
            } else {
                console.log('  ✅ SUCCESS! Type:', response.data.data?.rates?.[0]?.__typename || '(empty or null)');
                if (response.data.data?.rates && response.data.data.rates.length > 0) {
                    console.log('  Count:', response.data.data.rates.length);
                }
            }
        } catch (error) {
            console.log('  Error:', error.message);
        }
        console.log('');
    }
}

testWithDocParams();
