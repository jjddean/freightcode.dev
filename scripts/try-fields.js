// Try actual field combinations based on typical freight API responses
import axios from 'axios';

const SEARATES_KEY = 'K-BEEBD969-8265-41EB-A28B-E7E008650BA4';
const SEARATES_ID = '38163';

async function tryRealFields() {
    console.log('=== Testing Real Field Names ===\n');

    const tokenUrl = `https://www.searates.com/auth/platform-token?id=${SEARATES_ID}&api_key=${SEARATES_KEY}`;
    const tokenRes = await axios.get(tokenUrl);
    const token = tokenRes.data['s-token'];
    console.log('Token ✓\n');

    const graphqlUrl = 'https://rates.searates.com/graphql';

    // Try various field combinations - common freight API patterns
    const fieldTests = [
        // From web search: route with points
        'route { points { location { name } } }',
        // Simple primitives
        'id',
        'uuid',
        'rateId',
        // Common response fields (camelCase)  
        'totalAmount',
        'priceTotal',
        'freightCost',
        // Alternative naming patterns
        'cost',
        'freight',
        // Transit info
        'transitDays',
        'eta',
        // Provider info
        'carrier',
        'carrierName',
        'line',
        'shippingLine',
    ];

    for (const field of fieldTests) {
        const query = `query { rates(shippingType: FCL, container: ST20, coordinatesFrom: [31.23, 121.47], coordinatesTo: [33.75, -118.19]) { ${field} } }`;

        try {
            const response = await axios.post(graphqlUrl, { query }, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });

            if (response.data.errors) {
                const msg = response.data.errors[0]?.message || '';
                if (msg.includes('Cannot query field')) {
                    console.log(`❌ ${field} - not found`);
                } else if (msg.includes('Internal server error')) {
                    console.log(`⚠️  ${field} - internal error (might be valid!)`);
                } else {
                    console.log(`❓ ${field} - ${msg.substring(0, 50)}`);
                }
            } else {
                console.log(`✅ ${field} - SUCCESS!`);
                console.log('   Data:', JSON.stringify(response.data.data, null, 2).substring(0, 200));
            }
        } catch (error) {
            console.log(`💥 ${field} - ${error.message}`);
        }
    }
}

tryRealFields();
