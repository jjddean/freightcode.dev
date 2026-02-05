// Test the updated SeaRates GraphQL query
import axios from 'axios';

const SEARATES_KEY = 'K-BEEBD969-8265-41EB-A28B-E7E008650BA4';
const SEARATES_ID = '38163';

async function testUpdatedQuery() {
    console.log('=== Testing Updated SeaRates Query ===\n');

    // Get token
    const tokenUrl = `https://www.searates.com/auth/platform-token?id=${SEARATES_ID}&api_key=${SEARATES_KEY}`;
    const tokenRes = await axios.get(tokenUrl);
    const token = tokenRes.data['s-token'];
    console.log('Token ✓\n');

    const graphqlUrl = 'https://rates.searates.com/graphql';

    // Updated query matching the convex/searates.ts changes
    const query = `
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

    const variables = {
        shippingType: 'LCL',
        coordinatesFrom: [31.2304, 121.4737], // Shanghai
        coordinatesTo: [33.7490, -118.1940],  // Los Angeles
        weight: 100
    };

    console.log('Variables:', JSON.stringify(variables, null, 2));

    try {
        const response = await axios.post(graphqlUrl, {
            query,
            variables
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('\nResponse status:', response.status);

        if (response.data.errors) {
            console.log('\n❌ GraphQL Errors:', JSON.stringify(response.data.errors, null, 2));
        } else {
            const rates = response.data.data?.rates || [];
            console.log(`\n✅ Got ${rates.length} rates`);

            if (rates.length > 0) {
                console.log('\nFirst rate:');
                console.log(JSON.stringify(rates[0], null, 2));
            }
        }

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testUpdatedQuery();
