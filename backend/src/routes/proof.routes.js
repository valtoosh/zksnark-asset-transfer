const express = require('express');
const router = express.Router();
const proofController = require('../controllers/proof.controller');

// Generate proof
router.post('/generate', proofController.generateProof.bind(proofController));

// Verify proof
router.post('/verify', proofController.verifyProof.bind(proofController));

module.exports = router;
