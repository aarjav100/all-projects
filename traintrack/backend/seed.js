const mongoose = require('mongoose');
const { Train, Station } = require('./models/Train');
require('dotenv').config();

const stations = [
  // North Corridor (Delhi - Haridwar - Dehradun)
  { stationCode: "NDLS", stationName: "New Delhi", latitude: 28.6139, longitude: 77.2090 },
  { stationCode: "ANVT", stationName: "Anand Vihar Terminal", latitude: 28.6437, longitude: 77.3168 },
  { stationCode: "GZB", stationName: "Ghaziabad Junction", latitude: 28.6678, longitude: 77.4497 },
  { stationCode: "MODINAGAR", stationName: "Modinagar", latitude: 28.8407, longitude: 77.5855 },
  { stationCode: "MEERUT", stationName: "Meerut City", latitude: 28.9845, longitude: 77.7064 },
  { stationCode: "MOZ", stationName: "Muzaffarnagar", latitude: 29.4727, longitude: 77.7085 },
  { stationCode: "SRE", stationName: "Saharanpur Junction", latitude: 29.9640, longitude: 77.5460 },
  { stationCode: "RK", stationName: "Roorkee", latitude: 29.8543, longitude: 77.8880 },
  { stationCode: "HW", stationName: "Haridwar Junction", latitude: 29.9457, longitude: 78.1642 },
  { stationCode: "DDN", stationName: "Dehradun", latitude: 30.3165, longitude: 78.0322 },

  // East Corridor (Delhi - Lucknow - Varanasi)
  { stationCode: "CNB", stationName: "Kanpur Central", latitude: 26.4499, longitude: 80.3319 },
  { stationCode: "LKO", stationName: "Lucknow Charbagh", latitude: 26.8467, longitude: 80.9462 },
  { stationCode: "BSB", stationName: "Varanasi Junction", latitude: 25.3176, longitude: 82.9739 },
  { stationCode: "PRYJ", stationName: "Prayagraj Junction", latitude: 25.4358, longitude: 81.8463 },
  { stationCode: "HWH", stationName: "Howrah Junction", latitude: 22.5833, longitude: 88.3333 },

  // Peripheral
  { stationCode: "AGC", stationName: "Agra Cantt", latitude: 27.1577, longitude: 78.0062 },
  { stationCode: "MTJ", stationName: "Mathura Junction", latitude: 27.4924, longitude: 77.6737 },
  { stationCode: "VGLJ", stationName: "VGL Jhansi Junction", latitude: 25.4484, longitude: 78.5685 }
];

const trains = [
  {
    trainNumber: "12017",
    trainName: "Dehradun Shatabdi",
    source: "NDLS",
    destination: "DDN",
    type: "Shatabdi",
    routeStations: [
      { stationCode: "NDLS", stationName: "New Delhi", distanceFromSource: 0, scheduledArrivalTime: "06:45", scheduledDepartureTime: "06:45", day: 1 },
      { stationCode: "GZB", stationName: "Ghaziabad Junction", distanceFromSource: 26, scheduledArrivalTime: "07:23", scheduledDepartureTime: "07:25", day: 1 },
      { stationCode: "MEERUT", stationName: "Meerut City", distanceFromSource: 72, scheduledArrivalTime: "08:01", scheduledDepartureTime: "08:03", day: 1 },
      { stationCode: "MOZ", stationName: "Muzaffarnagar", distanceFromSource: 128, scheduledArrivalTime: "08:43", scheduledDepartureTime: "08:45", day: 1 },
      { stationCode: "SRE", stationName: "Saharanpur Junction", distanceFromSource: 186, scheduledArrivalTime: "09:50", scheduledDepartureTime: "10:15", day: 1 },
      { stationCode: "RK", stationName: "Roorkee", distanceFromSource: 221, scheduledArrivalTime: "10:48", scheduledDepartureTime: "10:50", day: 1 },
      { stationCode: "HW", stationName: "Haridwar Junction", distanceFromSource: 263, scheduledArrivalTime: "11:33", scheduledDepartureTime: "11:38", day: 1 },
      { stationCode: "DDN", stationName: "Dehradun", distanceFromSource: 315, scheduledArrivalTime: "12:50", scheduledDepartureTime: "12:50", day: 1 }
    ],
    totalDistance: 315
  },
  {
    trainNumber: "12018",
    trainName: "NDLS Shatabdi",
    source: "DDN",
    destination: "NDLS",
    type: "Shatabdi",
    routeStations: [
      { stationCode: "DDN", stationName: "Dehradun", distanceFromSource: 0, scheduledArrivalTime: "16:55", scheduledDepartureTime: "16:55", day: 1 },
      { stationCode: "HW", stationName: "Haridwar Junction", distanceFromSource: 52, scheduledArrivalTime: "18:11", scheduledDepartureTime: "18:16", day: 1 },
      { stationCode: "RK", stationName: "Roorkee", distanceFromSource: 94, scheduledArrivalTime: "18:58", scheduledDepartureTime: "19:00", day: 1 },
      { stationCode: "SRE", stationName: "Saharanpur Junction", distanceFromSource: 129, scheduledArrivalTime: "19:33", scheduledDepartureTime: "19:55", day: 1 },
      { stationCode: "MOZ", stationName: "Muzaffarnagar", distanceFromSource: 187, scheduledArrivalTime: "20:41", scheduledDepartureTime: "20:43", day: 1 },
      { stationCode: "MEERUT", stationName: "Meerut City", distanceFromSource: 243, scheduledArrivalTime: "21:23", scheduledDepartureTime: "21:25", day: 1 },
      { stationCode: "GZB", stationName: "Ghaziabad Junction", distanceFromSource: 289, scheduledArrivalTime: "22:18", scheduledDepartureTime: "22:20", day: 1 },
      { stationCode: "NDLS", stationName: "New Delhi", distanceFromSource: 315, scheduledArrivalTime: "22:50", scheduledDepartureTime: "22:50", day: 1 }
    ],
    totalDistance: 315
  },
  {
    trainNumber: "22416",
    trainName: "Vande Bharat Express",
    source: "NDLS",
    destination: "BSB",
    type: "Superfast",
    routeStations: [
      { stationCode: "NDLS", stationName: "New Delhi", distanceFromSource: 0, scheduledArrivalTime: "06:00", scheduledDepartureTime: "06:00", day: 1 },
      { stationCode: "CNB", stationName: "Kanpur Central", distanceFromSource: 440, scheduledArrivalTime: "10:08", scheduledDepartureTime: "10:10", day: 1 },
      { stationCode: "PRYJ", stationName: "Prayagraj Junction", distanceFromSource: 635, scheduledArrivalTime: "12:08", scheduledDepartureTime: "12:10", day: 1 },
      { stationCode: "BSB", stationName: "Varanasi Junction", distanceFromSource: 755, scheduledArrivalTime: "14:00", scheduledDepartureTime: "14:00", day: 1 }
    ],
    totalDistance: 755
  },
  {
    trainNumber: "12435",
    trainName: "Dehradun AC Express",
    source: "ANVT",
    destination: "DDN",
    type: "Superfast",
    routeStations: [
      { stationCode: "ANVT", stationName: "Anand Vihar Terminal", distanceFromSource: 0, scheduledArrivalTime: "23:55", scheduledDepartureTime: "23:55", day: 1 },
      { stationCode: "GZB", stationName: "Ghaziabad Junction", distanceFromSource: 13, scheduledArrivalTime: "00:27", scheduledDepartureTime: "00:29", day: 2 },
      { stationCode: "MEERUT", stationName: "Meerut City", distanceFromSource: 60, scheduledArrivalTime: "01:13", scheduledDepartureTime: "01:15", day: 2 },
      { stationCode: "MOZ", stationName: "Muzaffarnagar", distanceFromSource: 115, scheduledArrivalTime: "02:00", scheduledDepartureTime: "02:02", day: 2 },
      { stationCode: "HW", stationName: "Haridwar Junction", distanceFromSource: 250, scheduledArrivalTime: "04:50", scheduledDepartureTime: "05:00", day: 2 },
      { stationCode: "DDN", stationName: "Dehradun", distanceFromSource: 302, scheduledArrivalTime: "06:10", scheduledDepartureTime: "06:10", day: 2 }
    ],
    totalDistance: 302
  },
  {
      trainNumber: "18477",
      trainName: "Kalinga Utkal Express",
      source: "PURI",
      destination: "YNRK",
      type: "Express",
      routeStations: [
        { stationCode: "MTJ", stationName: "Mathura Junction", distanceFromSource: 1720, scheduledArrivalTime: "11:55", scheduledDepartureTime: "12:00", day: 2 },
        { stationCode: "AGC", stationName: "Agra Cantt", distanceFromSource: 1750, scheduledArrivalTime: "12:40", scheduledDepartureTime: "12:45", day: 2 },
        { stationCode: "NDLS", stationName: "New Delhi", distanceFromSource: 1910, scheduledArrivalTime: "15:25", scheduledDepartureTime: "15:40", day: 2 },
        { stationCode: "GZB", stationName: "Ghaziabad Junction", distanceFromSource: 1935, scheduledArrivalTime: "16:20", scheduledDepartureTime: "16:22", day: 2 },
        { stationCode: "MODINAGAR", stationName: "Modinagar", distanceFromSource: 1963, scheduledArrivalTime: "16:48", scheduledDepartureTime: "16:50", day: 2 },
        { stationCode: "MEERUT", stationName: "Meerut City", distanceFromSource: 1983, scheduledArrivalTime: "17:15", scheduledDepartureTime: "17:20", day: 2 },
        { stationCode: "MOZ", stationName: "Muzaffarnagar", distanceFromSource: 2038, scheduledArrivalTime: "18:15", scheduledDepartureTime: "18:17", day: 2 },
        { stationCode: "HW", stationName: "Haridwar Junction", distanceFromSource: 2150, scheduledArrivalTime: "21:00", scheduledDepartureTime: "21:10", day: 2 }
      ],
      totalDistance: 2200
  },
  {
    trainNumber: "12004",
    trainName: "Lucknow Shatabdi",
    source: "NDLS",
    destination: "LKO",
    type: "Shatabdi",
    routeStations: [
      { stationCode: "NDLS", stationName: "New Delhi", distanceFromSource: 0, scheduledArrivalTime: "06:10", scheduledDepartureTime: "06:10", day: 1 },
      { stationCode: "GZB", stationName: "Ghaziabad Junction", distanceFromSource: 26, scheduledArrivalTime: "06:48", scheduledDepartureTime: "06:50", day: 1 },
      { stationCode: "CNB", stationName: "Kanpur Central", distanceFromSource: 440, scheduledArrivalTime: "11:20", scheduledDepartureTime: "11:25", day: 1 },
      { stationCode: "LKO", stationName: "Lucknow Charbagh", distanceFromSource: 512, scheduledArrivalTime: "12:40", scheduledDepartureTime: "12:40", day: 1 }
    ],
    totalDistance: 512
  }
];

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/traintrack';
    await mongoose.connect(mongoURI);
    console.log("Connected to DB for Professional Seeding...");
    
    await Station.deleteMany({});
    await Train.deleteMany({});
    
    await Station.insertMany(stations);
    await Train.insertMany(trains);
    
    console.log("Database Seeded with Professional Real-world Data!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
