// server.js - Your Custom Roblox API Proxy
// This proxies requests from your Roblox game to Roblox's APIs

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins (Roblox game servers)
app.use(cors());
app.use(express.json());

// Base URL for Roblox APIs
const ROBLOX_APIS = {
    games: 'https://games.roblox.com',
    catalog: 'https://catalog.roblox.com',
    users: 'https://users.roblox.com'
};

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'online', 
        message: 'Roblox API Proxy is running!',
        endpoints: {
            games: '/games/*',
            catalog: '/catalog/*',
            users: '/users/*'
        }
    });
});

// Proxy for games.roblox.com
app.get('/games/*', async (req, res) => {
    try {
        const path = req.params[0];
        const queryString = req.url.split('?')[1] || '';
        const url = `${ROBLOX_APIS.games}/${path}${queryString ? '?' + queryString : ''}`;
        
        console.log(`[Games API] Fetching: ${url}`);
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Roblox/WinInet',
                'Accept': 'application/json'
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('[Games API] Error:', error.message);
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

// Proxy for catalog.roblox.com
app.get('/catalog/*', async (req, res) => {
    try {
        const path = req.params[0];
        const queryString = req.url.split('?')[1] || '';
        const url = `${ROBLOX_APIS.catalog}/${path}${queryString ? '?' + queryString : ''}`;
        
        console.log(`[Catalog API] Fetching: ${url}`);
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Roblox/WinInet',
                'Accept': 'application/json'
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('[Catalog API] Error:', error.message);
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

// Proxy for users.roblox.com
app.get('/users/*', async (req, res) => {
    try {
        const path = req.params[0];
        const queryString = req.url.split('?')[1] || '';
        const url = `${ROBLOX_APIS.users}/${path}${queryString ? '?' + queryString : ''}`;
        
        console.log(`[Users API] Fetching: ${url}`);
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Roblox/WinInet',
                'Accept': 'application/json'
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('[Users API] Error:', error.message);
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Roblox API Proxy running on port ${PORT}`);
    console.log(`📡 Ready to proxy requests!`);
});
