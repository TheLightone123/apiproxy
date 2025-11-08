const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so Roblox can access your API
app.use(cors());
app.use(express.json());

// Log all requests (helpful for debugging)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// ==========================================
// ENDPOINT: Get User's Games
// ==========================================
app.get('/api/users/:userId/games', async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log(`Fetching games for user: ${userId}`);
        
        const response = await axios.get(
            `https://games.roblox.com/v2/users/${userId}/games?limit=50`,
            {
                headers: {
                    'User-Agent': 'Roblox/WinInet',
                    'Accept': 'application/json'
                }
            }
        );
        
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching games:', error.message);
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

// ==========================================
// ENDPOINT: Get Gamepasses for a Game
// ==========================================
app.get('/api/games/:universeId/game-passes', async (req, res) => {
    try {
        const { universeId } = req.params;
        const { cursor = '', limit = 100 } = req.query;
        
        console.log(`Fetching gamepasses for universe: ${universeId}`);
        
        const response = await axios.get(
            `https://games.roblox.com/v1/games/${universeId}/game-passes`,
            {
                params: {
                    sortOrder: 'Asc',
                    limit: limit,
                    cursor: cursor
                },
                headers: {
                    'User-Agent': 'Roblox/WinInet',
                    'Accept': 'application/json'
                }
            }
        );
        
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching gamepasses:', error.message);
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

// ==========================================
// ENDPOINT: Get User's T-Shirts
// ==========================================
app.get('/api/catalog/items', async (req, res) => {
    try {
        const { creatorId, cursor = '' } = req.query;
        
        if (!creatorId) {
            return res.status(400).json({ error: 'creatorId is required' });
        }
        
        console.log(`Fetching catalog items for creator: ${creatorId}`);
        
        const response = await axios.get(
            'https://catalog.roblox.com/v1/search/items/details',
            {
                params: {
                    Category: 3,
                    CreatorTargetId: creatorId,
                    CreatorType: 1,
                    Limit: 30,
                    Cursor: cursor
                },
                headers: {
                    'User-Agent': 'Roblox/WinInet',
                    'Accept': 'application/json'
                }
            }
        );
        
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching catalog items:', error.message);
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

// ==========================================
// ENDPOINT: Health Check
// ==========================================
app.get('/health', (req, res) => {
    res.json({ 
        status: 'online',
        timestamp: new Date().toISOString(),
        endpoints: [
            'GET /api/users/:userId/games',
            'GET /api/games/:universeId/game-passes',
            'GET /api/catalog/items?creatorId={id}&cursor={cursor}'
        ]
    });
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Roblox Proxy Server Running!`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌐 Health Check: http://localhost:${PORT}/health`);
    console.log('='.repeat(50));
});
