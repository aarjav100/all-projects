const mongoose = require('mongoose');
const { Train, Station } = require('../backend/models/Train');
require('dotenv').config({ path: '../backend/.env' });

const testSearch = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB...");

  const from = "MEERUT";
  const to = "HW";

  const direct = await Train.find({
    $and: [
      { 'routeStations.stationCode': from },
      { 'routeStations.stationCode': to }
    ]
  });

  const validated = direct.filter(t => {
    const fIdx = t.routeStations.findIndex(s => s.stationCode === from);
    const tIdx = t.routeStations.findIndex(s => s.stationCode === to);
    return fIdx !== -1 && tIdx !== -1 && fIdx < tIdx;
  });

  console.log(`Found ${validated.length} direct trains from ${from} to ${to}`);
  validated.forEach(t => console.log(` - ${t.trainName} (#${t.trainNumber})`));

  process.exit();
};

testSearch();
