const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8001;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'gabriel-users',
        port: PORT,
        timestamp: new Date().toISOString(),
        globally_scalable: true
    });
});

app.get('/', (req, res) => {
    res.json({
        service: 'gabriel-users',
        description: 'Gabriel AI gabriel-users microservice',
        port: PORT,
        culturally_adaptive: true,
        global_expansion_ready: true
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎯 ${PORT} - gabriel-users service running globally scalable`);
});
