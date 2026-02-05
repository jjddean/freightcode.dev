// Full SeaRates API test - token + GraphQL query
import axios from 'axios';

const SEARATES_KEY = 'K-BEEBD969-8265-41EB-A28B-E7E008650BA4';
const SEARATES_ID = '38163';

async function testSeaRatesFullFlow() {
    console.log('=== SeaRates Full API Test ===\n');

    // Step 1: Get token
    console.log('1. Getting token...');
    const tokenUrl = `https://www.searates.com/auth/platform-token?id=${SEARATES_ID}&api_key=${SEARATES_KEY}`;

    let token;
    try {
        const tokenRes = await axios.get(tokenUrl);
        token = tokenRes.data['s-token'];
        console.log('   ✓ Token obtained:', token.substring(0, 50) + '...\n');
    } catch (error) {
        console.error('   ✗ Token error:', error.response?.data || error.message);
        return;
    }

    // Step 2: Test GraphQL query
    console.log('2. Testing GraphQL rates query...');

    const graphqlUrl = 'https://rates.searates.com/graphql';

    // Shanghai to Los Angeles coordinates
    const variables = {
        shippingType: 'LCL',
        coordinatesFrom: [31.2304, 121.4737], // Shanghai
        coordinatesTo: [33.7490, -118.1940],  // Los Angeles
        date: new Date().toISOString().split('T')[0],
        weight: 100
    };

    const query = `
    query GetRates(
      $shippingType: String!
      $coordinatesFrom: [Float!]!
      $coordinatesTo: [Float!]!
      $date: String
      $weight: Float
    ) {
      rates(
        shippingType: $shippingType
        coordinatesFrom: $coordinatesFrom
        coordinatesTo: $coordinatesTo
        date: $date
        weight: $weight
      ) {
        carrier
        carrierLogo
        transitTime
        price
        currency
        validUntil
        service
        containerType
        details {
          description
          amount
        }
      }
    }
    `;

    try {
        console.log('   Request variables:', JSON.stringify(variables, null, 2));

        const response = await axios.post(graphqlUrl, {
            query,
            variables
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('\n   Response status:', response.status);
        console.log('   Response data:', JSON.stringify(response.data, null, 2));

        if (response.data.errors) {
            console.log('\n   ⚠ GraphQL Errors:', response.data.errors);
        }

        const rates = response.data.data?.rates || [];
        console.log(`\n   Found ${rates.length} rates`);

        if (rates.length > 0) {
            console.log('\n   Sample rate:');
            console.log('   ', JSON.stringify(rates[0], null, 2));
        }

    } catch (error) {
        console.error('   ✗ GraphQL error:', error.response?.status, error.response?.data || error.message);
    }
}

testSeaRatesFullFlow();
