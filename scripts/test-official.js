// Test with EXACT fields from official SeaRates documentation
import axios from 'axios';

const SEARATES_KEY = 'K-BEEBD969-8265-41EB-A28B-E7E008650BA4';
const SEARATES_ID = '38163';

async function testOfficialSchema() {
    console.log('=== Testing Official Schema Fields ===\n');

    const tokenUrl = `https://www.searates.com/auth/platform-token?id=${SEARATES_ID}&api_key=${SEARATES_KEY}`;
    const tokenRes = await axios.get(tokenUrl);
    const token = tokenRes.data['s-token'];
    console.log('Token ✓\n');

    const graphqlUrl = 'https://rates.searates.com/graphql';

    // Query with official documented fields
    const query = `
    query GetRates {
      rates(
        shippingType: FCL
        container: ST20
        coordinatesFrom: [31.23, 121.47]
        coordinatesTo: [33.75, -118.19]
      ) {
        shipmentId
        validityFrom
        validityTo
        totalPrice
        totalCurrency
        totalTransitTime
        queryShippingType
        alternative
        expired
        spaceGuarantee
        spot
        indicative
        points {
          location {
            name
            country
            lat
            lng
          }
          shippingType
          provider
          pointTotal
          routeTotal
          totalPrice
          totalCurrency
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
        }
      }
    }
    `;

    console.log('Executing query with documented fields...\n');

    try {
        const response = await axios.post(graphqlUrl, { query }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Response status:', response.status);

        if (response.data.errors) {
            console.log('\n❌ GraphQL Errors:');
            response.data.errors.forEach((e, i) => {
                console.log(`  ${i + 1}. ${e.message}`);
            });
        } else {
            const rates = response.data.data?.rates || [];
            console.log(`\n✅ SUCCESS! Got ${rates.length} rates`);

            if (rates.length > 0) {
                console.log('\nFirst rate preview:');
                const r = rates[0];
                console.log(`  shipmentId: ${r.shipmentId}`);
                console.log(`  totalPrice: ${r.totalPrice} ${r.totalCurrency}`);
                console.log(`  totalTransitTime: ${r.totalTransitTime} days`);
                console.log(`  validityTo: ${r.validityTo}`);
                console.log(`  points: ${r.points?.length} legs`);

                if (r.points?.length > 0) {
                    const p = r.points[0];
                    console.log(`  First point:`);
                    console.log(`    location: ${p.location?.name}, ${p.location?.country}`);
                    console.log(`    provider: ${p.provider}`);
                }
            }
        }

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testOfficialSchema();
