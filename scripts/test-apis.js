import axios from 'axios';
import fs from 'fs';

// Test Shippo API (free tier, well documented)
async function testShippo() {
    console.log('=== Testing Shippo API ===');

    // Get a test API token from https://apps.goshippo.com/
    // For now, test if we get a proper response structure
    const SHIPPO_TOKEN = 'shippo_test_'; // placeholder - needs real token

    try {
        const res = await axios.post('https://api.goshippo.com/shipments/', {
            address_from: {
                name: 'Sender',
                street1: '123 Test St',
                city: 'San Francisco',
                state: 'CA',
                zip: '94104',
                country: 'US'
            },
            address_to: {
                name: 'Recipient',
                street1: '456 Main St',
                city: 'New York',
                state: 'NY',
                zip: '10001',
                country: 'US'
            },
            parcels: [{
                length: '10',
                width: '10',
                height: '10',
                distance_unit: 'in',
                weight: '5',
                mass_unit: 'lb'
            }],
            async: false
        }, {
            headers: {
                'Authorization': `ShippoToken ${SHIPPO_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Shippo Status:', res.status);
        console.log('Shippo Data:', JSON.stringify(res.data, null, 2));
        return { success: true, data: res.data };
    } catch (error) {
        console.log('Shippo Error Status:', error.response?.status);
        console.log('Shippo Error:', error.response?.data || error.message);
        return { success: false, status: error.response?.status, error: error.response?.data || error.message };
    }
}

// Test the SeaRates GraphQL endpoint (the one that actually exists)
async function testSeaRatesGraphQL() {
    console.log('\n=== Testing SeaRates GraphQL (rates.searates.com) ===');

    const SEARATES_KEY = 'K-BEEBD969-8265-41EB-A28B-E7E008650BA4';
    const SEARATES_ID = '1585203';
    const SEARATES_LOGIN = 'jkdproductivity@gmail.com';
    const SEARATES_PASSWORD = '9DZBk7q.Zs4M73T';

    try {
        // First get token with all params
        const tokenUrl = `https://www.searates.com/auth/platform-token?id=${SEARATES_ID}&api_key=${SEARATES_KEY}&login=${encodeURIComponent(SEARATES_LOGIN)}&password=${encodeURIComponent(SEARATES_PASSWORD)}`;
        console.log('Getting token...');
        const tokenRes = await axios.get(tokenUrl);
        console.log('Token response:', tokenRes.data);

        if (tokenRes.data.token) {
            console.log('Token obtained! Testing GraphQL...');
            const query = `
        query rates($shippingType: ShippingType!) {
          rates(shippingType: $shippingType, pointIdFrom: "C_Shanghai", pointIdTo: "C_London", weight: 1000, volume: 1) {
            totalPrice
            totalCurrency
            totalTransitTime
          }
        }
      `;
            const gqlRes = await axios.post('https://rates.searates.com/graphql',
                { query, variables: { shippingType: 'LCL' } },
                { headers: { 'Authorization': `Bearer ${tokenRes.data.token}` } }
            );
            console.log('GraphQL Result:', JSON.stringify(gqlRes.data, null, 2));
            return { success: true, token: 'obtained', rates: gqlRes.data };
        }
        return { success: false, tokenResponse: tokenRes.data };
    } catch (error) {
        console.log('SeaRates Error:', error.response?.status, error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
}

async function main() {
    const results = {
        shippo: await testShippo(),
        searatesGraphQL: await testSeaRatesGraphQL()
    };

    fs.writeFileSync('api-test-results.json', JSON.stringify(results, null, 2));
    console.log('\n=== Results saved to api-test-results.json ===');
}

main();
