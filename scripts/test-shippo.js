import axios from 'axios';
import fs from 'fs';

const SHIPPO_TOKEN = 'shippo_test_'; // placeholder - needs real token

async function testShippo() {
    console.log('=== Testing Shippo API with real token ===');

    try {
        const res = await axios.post('https://api.goshippo.com/shipments/', {
            address_from: {
                name: 'Sender',
                street1: '215 Clayton St',
                city: 'San Francisco',
                state: 'CA',
                zip: '94117',
                country: 'US'
            },
            address_to: {
                name: 'Recipient',
                street1: '1600 Pennsylvania Ave NW',
                city: 'Washington',
                state: 'DC',
                zip: '20500',
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
        console.log('Rates count:', res.data.rates?.length || 0);

        // Show first few rates
        if (res.data.rates?.length > 0) {
            console.log('\nSample rates:');
            res.data.rates.slice(0, 5).forEach((rate, i) => {
                console.log(`${i + 1}. ${rate.provider} - ${rate.servicelevel?.name} - $${rate.amount} ${rate.currency} - ${rate.estimated_days} days`);
            });
        }

        fs.writeFileSync('shippo-test-results.json', JSON.stringify(res.data, null, 2));
        return { success: true, ratesCount: res.data.rates?.length };
    } catch (error) {
        console.log('Shippo Error:', error.response?.status, error.response?.data || error.message);
        fs.writeFileSync('shippo-test-results.json', JSON.stringify({
            error: true,
            status: error.response?.status,
            data: error.response?.data || error.message
        }, null, 2));
        return { success: false, error: error.response?.data || error.message };
    }
}

testShippo();
