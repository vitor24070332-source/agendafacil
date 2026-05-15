const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'availability ok' }));
router.post('/', (req, res) => res.json({ message: 'created' }));
router.put('/:id', (req, res) => res.json({ message: 'updated' }));
router.delete('/:id', (req, res) => res.json({ message: 'deleted' }));

module.exports = router;
