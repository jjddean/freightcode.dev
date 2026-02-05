import axios from 'axios';
import fs from 'fs';

const SEARATES_KEY = 'K-BEEBD969-8265-41EB-A28B-E7E008650BA4';
const SEARATES_ID = '38163';

async function testSeaRates() {
    const url = `https://www.searates.com/auth/platform-token?id=${SEARATES_ID}&api_key=${SEARATES_KEY}`;

    try {
        const res = await axios.get(url);
        const output = {
            status: res.status,
            data: res.data
        };
        fs.writeFileSync('searates-result.json', JSON.stringify(output, null, 2));
        console.log('Result written to searates-result.json');
    } catch (error) {
        const output = {
            error: true,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        };
        fs.writeFileSync('searates-result.json', JSON.stringify(output, null, 2));
        console.log('Error written to searates-result.json');
    }
}

testSeaRates();
