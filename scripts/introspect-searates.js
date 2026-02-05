// Introspect SeaRates GraphQL schema
import axios from 'axios';

const SEARATES_KEY = 'K-BEEBD969-8265-41EB-A28B-E7E008650BA4';
const SEARATES_ID = '38163';

async function introspectSchema() {
    console.log('=== SeaRates Schema Introspection ===\n');

    // Get token
    const tokenUrl = `https://www.searates.com/auth/platform-token?id=${SEARATES_ID}&api_key=${SEARATES_KEY}`;
    const tokenRes = await axios.get(tokenUrl);
    const token = tokenRes.data['s-token'];
    console.log('Token obtained ✓\n');

    const graphqlUrl = 'https://rates.searates.com/graphql';

    // Introspection query for Rate type
    const introspectionQuery = `
    query IntrospectRate {
      __type(name: "Rate") {
        name
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
    `;

    try {
        const response = await axios.post(graphqlUrl, {
            query: introspectionQuery
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Rate type fields:');
        const fields = response.data.data?.__type?.fields || [];
        fields.forEach(f => {
            const typeName = f.type.ofType?.name || f.type.name || f.type.kind;
            console.log(`  - ${f.name}: ${typeName}`);
        });

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }

    // Also get ShippingTypes enum
    const enumQuery = `
    query IntrospectShippingTypes {
      __type(name: "ShippingTypes") {
        name
        enumValues {
          name
        }
      }
    }
    `;

    try {
        const response = await axios.post(graphqlUrl, {
            query: enumQuery
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('\nShippingTypes enum values:');
        const enumVals = response.data.data?.__type?.enumValues || [];
        enumVals.forEach(v => console.log(`  - ${v.name}`));

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }

    // Get Query root
    const queryRoot = `
    query IntrospectQuery {
      __type(name: "Query") {
        fields {
          name
          args {
            name
            type {
              name
              kind
              ofType { name kind }
            }
          }
        }
      }
    }
    `;

    try {
        const response = await axios.post(graphqlUrl, {
            query: queryRoot
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('\nQuery fields:');
        const fields = response.data.data?.__type?.fields || [];
        fields.forEach(f => {
            console.log(`  - ${f.name}`);
            f.args?.forEach(a => {
                const typeName = a.type.ofType?.name || a.type.name || a.type.kind;
                console.log(`      arg: ${a.name} (${typeName})`);
            });
        });

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

introspectSchema();
