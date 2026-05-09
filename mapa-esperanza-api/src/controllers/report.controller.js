const pool = require('../config/db'); // Importa la conexión a la BD

// Obtiene solo los reportes APROBADOS desde la base de datos
exports.getReports = async (req, res) => {
  try {
    const allReports = await pool.query(
      "SELECT id, category, description, ST_X(location) as lng, ST_Y(location) as lat FROM reports ORDER BY created_at DESC" //  WHERE is_approved = TRUE
    );
    res.status(200).json(allReports.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
};

// Crea un nuevo reporte (por defecto, no estará aprobado)
exports.createReport = async (req, res) => {
  try {
    const { category, description, lat, lng } = req.body;

    // Validación simple
    if (!category || !description || !lat || !lng) {
      return res.status(400).json({ msg: "Por favor, envía todos los campos requeridos." });
    }

    // Usando PostGIS para crear un punto geográfico
    const newReport = await pool.query(
      "INSERT INTO reports (category, description, location) VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)) RETURNING *",
      [category, description, lng, lat]
    );

    res.status(201).json(newReport.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
};