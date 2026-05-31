const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Alarm = require('./models/Alarm');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/alarmclock', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/alarms', async (req, res) => {
  const alarms = await Alarm.find();
  res.json(alarms);
});

app.post('/alarms', async (req, res) => {
  const alarm = new Alarm(req.body);
  await alarm.save();
  res.json(alarm);
});

app.delete('/alarms/:id', async (req, res) => {
  await Alarm.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

app.patch('/alarms/:id', async (req, res) => {
  const alarm = await Alarm.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(alarm);
});

app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});
