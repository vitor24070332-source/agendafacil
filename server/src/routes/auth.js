const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => res.json({ token: 'placeholder' }));
router.post('/register', (req, res) => res.json({ message: 'registered' }));
router.post('/forgot-password', (req, res) => res.json({ message: 'email sent' }));
router.get('/google/callback', (req, res) => res.json({ message: 'google oauth callback' }));

module.exports = router;
