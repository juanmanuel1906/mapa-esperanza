const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

// Obtener todos los reportes
router.get('/reports', reportController.getReports);

// Crear un nuevo reporte
router.post('/reports', reportController.createReport);

module.exports = router;
