require('dotenv').config();
const express = require('express');

const departmentRoutes = require('./routes/departments');
const employeeRoutes   = require('./routes/employees');
const dashboardRoutes  = require('./routes/dashboard');
const errorHandler     = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/departments', departmentRoutes);
app.use('/employees',   employeeRoutes);
app.use('/dashboard',   dashboardRoutes);
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome to People Hub API' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`People Hub API running on http://localhost:${PORT}`);
});

module.exports = app;
