import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Base route to verify server is running
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running inside the MarketLive app!' });
});

// Placeholder for migrated functions
// TODO: Paste user backend functions here

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
