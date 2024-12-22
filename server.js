const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
app.use(express.json());
const filePath = path.join(__dirname, 'hospitalData.json');
const readData = () => {
  const rawData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(rawData);
};
const writeData = (data) => {
  const jsonData = JSON.stringify(data, null, 2); 
  fs.writeFileSync(filePath, jsonData, 'utf8');
};
app.get('/hospitals', (req, res) => {
  const data = readData();
  res.json(data.hospitals);
});
app.post('/hospitals', (req, res) => {
  const data = readData();
  const newHospital = req.body;
  newHospital.id = data.hospitals.length + 1;
  data.hospitals.push(newHospital);
  writeData(data);
  res.status(201).json(newHospital);
});
app.put('/hospitals/:id', (req, res) => {
  const data = readData();
  const hospitalId = parseInt(req.params.id, 10);
  const updatedHospital = req.body;
  const hospitalIndex = data.hospitals.findIndex(h => h.id === hospitalId);
  if (hospitalIndex === -1) {
    return res.status(404).json({ message: `Hospital with ID ${hospitalId} not found` });
  }
  data.hospitals[hospitalIndex] = { ...data.hospitals[hospitalIndex], ...updatedHospital };
  writeData(data);
  res.json(data.hospitals[hospitalIndex]);
});
app.delete('/hospitals/:id', (req, res) => {
  const data = readData();
  const hospitalId = parseInt(req.params.id, 10);
  const hospitalIndex = data.hospitals.findIndex(h => h.id === hospitalId);
  if (hospitalIndex === -1) {
    return res.status(404).json({ message: `Hospital with ID ${hospitalId} not found` });
  }
  const removedHospital = data.hospitals.splice(hospitalIndex, 1);
  writeData(data);
  res.json(removedHospital);
});
app.listen(3000, () => {
  console.log(`Hospital app server running on port 3000`);
});
