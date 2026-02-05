// Try rate (singular) and introspect its fields
import axios from 'axios';

const SEARATES_KEY = 'K-BEEBD969-8265-41EB-A28B-E7E008650BA4';
const SEARATES_ID = '38163';

async function tryRateSingular() {
    console.log('=== Testing rate (singular) query ===\n');

    const tokenUrl = `https://www.searates.com/auth/platform-token?id=${SEARATES_ID}&api_key=${SEARATES_KEY}`;
    const tokenRes = await axios.get(tokenUrl);
    const token = tokenRes.data['s-token'];
    console.log('Token ✓\n');

    const graphqlUrl = 'https://rates.searates.com/graphql';

    // First, get schema of Query type
    const schemaQuery = `{ __schema { queryType { name fields { name description args { name type { name kind ofType { name } } } } } } }`;

    try {
        console.log('Getting Query schema...');
        const schemaRes = await axios.post(graphqlUrl, { query: schemaQuery }, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (schemaRes.data.data?.__schema?.queryType?.fields) {
            const fields = schemaRes.data.data.__schema.queryType.fields;
            console.log('Available queries:');
            fields.forEach(f => {
                console.log(`  - ${f.name}`);
                if (f.args?.length) {
                    f.args.forEach(a => console.log(`      arg: ${a.name} (${a.type?.name || a.type?.ofType?.name || a.type?.kind})`));
                }
            });
        } else {
            console.log('Schema introspection disabled or failed');
        }
    } catch (err) {
        console.log('Schema query error:', err.response?.data?.errors?.[0]?.message || err.message);
    }

    console.log('\n');

    // Try rate singular with __typename
    const queries = [
        {
            name: 'rate singular with shippingType',
            query: `query { rate(shippingType: LCL, coordinatesFrom: [31.23, 121.47], coordinatesTo: [33.75, -118.19], weight: 100) { __typename } }`
        },
        {
            name: 'rate without weight',
            query: `query { rate(shippingType: LCL, coordinatesFrom: [31.23, 121.47], coordinatesTo: [33.75, -118.19]) { __typename } }`
        },
        {
            name: 'rate with FCL',
            query: `query { rate(shippingType: FCL, coordinatesFrom: [31.23, 121.47], coordinatesTo: [33.75, -118.19]) { __typename } }`
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
                console.log('  ✅ SUCCESS!');
                console.log('  Data:', JSON.stringify(response.data.data, null, 2));
            }
        } catch (error) {
            console.log('  Error:', error.message);
        }
        console.log('');
    }
}

tryRateSingular();
