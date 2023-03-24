const path = require('path');
const express = require('express');
const hardware = require('./hardware.js');

const PORT = process.env.NODE_ENV === 'production' ? 80 : 8080;

// Express is a very common web server framework for Node.js
const app = express();

// Serve static frontend files from this server
app.use(express.static(path.join(__dirname, '../frontend')));
// Expect JSON data in request bodies
app.use(express.json());

// ROUTES

// GET /api/health
app.get('/api/health', (req, res) => {
  res.send({ ok: true })
});

// GET /api/motor
// Get the last requested motor power
app.get('/api/motor', (req, res) => {
  res.send({
    power: hardware.getMotorPower()
  });
});

// POST /api/motor
// Set the motor power
app.post('/api/motor', (req, res) => {
  const power = req.body.power;
  if (power === undefined) {
    res.status(400).send({ error: 'Missing power parameter' });
    return;
  }
  if (typeof power !== 'number' || power < 0 || power > 1) {
    res.status(400).send({ error: 'Power parameter must be a number between 0 and 1' });
    return;
  }
  hardware.setMotorPower(power);
  res.send({ ok: true });
});

// GET /api/led
// Get the last requested LED color
app.get('/api/led', (req, res) => {
  res.send(hardware.getLedColor());
});

// POST /api/led
// Set the LED color
app.post('/api/led', (req, res) => {
  const color = req.body;
  if (color.r === undefined || color.g === undefined || color.b === undefined) {
    res.status(400).send({
      error: 'Expected r, g,  and b parameters. Got: ' + Object.keys(color).join()
    });
    return;
  }
  if (typeof color.r !== 'number' || typeof color.g !== 'number' || typeof color.b !== 'number') {
    res.status(400).send({ error: 'r, g, and b parameters must be numbers between 0 and 255' });
    return;
  }
  hardware.setLedColor(color.r, color.g, color.b);
  res.send({ ok: true });
});

// GET /api/measured-speed
// Returns an array of recently measured rpm values
app.get('/api/measured-speed', (req, res) => {
  const measurements = hardware.getEncoderData();
  res.send({
    data: measurements
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

