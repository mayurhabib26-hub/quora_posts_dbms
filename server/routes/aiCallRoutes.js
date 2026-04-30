const express = require('express');
const axios = require('axios');
const router = express.Router();

const VAPI_API_KEY = process.env.VAPI_API_KEY;
const ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;
const PHONE_NUMBER_ID = process.env.VAPI_PHONE_NUMBER_ID;

// POST /api/ai-call — Initiate an AI voice call via VAPI
router.post('/', async (req, res) => {
    const { name, phone } = req.body;

    // Validate inputs
    if (!name || !phone) {
        return res.status(400).json({ 
            success: false, 
            message: 'Name and phone number are required.' 
        });
    }

    // Validate phone format (must start with + and have at least 10 digits)
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Phone number must be in international format (e.g., +91XXXXXXXXXX).' 
        });
    }

    // Check that API keys are configured
    if (!VAPI_API_KEY) {
        return res.status(500).json({ 
            success: false, 
            message: 'VAPI API key is missing in server environment.' 
        });
    }

    if (!ASSISTANT_ID) {
        return res.status(500).json({ 
            success: false, 
            message: 'VAPI Assistant ID is missing in server environment.' 
        });
    }

    if (!PHONE_NUMBER_ID || PHONE_NUMBER_ID === 'PASTE_YOUR_PHONE_NUMBER_ID_HERE') {
        return res.status(500).json({ 
            success: false, 
            message: 'VAPI Phone Number ID is not configured. Please add it to your .env file.' 
        });
    }

    try {
        const response = await axios.post(
            'https://api.vapi.ai/call',
            {
                assistantId: ASSISTANT_ID,
                phoneNumberId: PHONE_NUMBER_ID,
                customer: {
                    number: phone,
                    name: name
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${VAPI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('VAPI call initiated successfully:', response.data?.id);
        res.json({ 
            success: true, 
            message: 'AI agent is calling you now! 📞',
            callId: response.data?.id 
        });
    } catch (err) {
        console.error('VAPI call error:', err.response?.data || err.message);
        res.status(500).json({ 
            success: false, 
            message: err.response?.data?.message || 'Failed to initiate the call. Please try again.' 
        });
    }
});

module.exports = router;
