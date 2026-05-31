const { Train, Station } = require('../models/Train');
const axios = require('axios');

exports.getStationSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    const stations = await Station.find({
      $or: [
        { stationName: { $regex: q, $options: 'i' } },
        { stationCode: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);
    
    res.json(stations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchTrains = async (req, res) => {
// ... existing code ...

  try {
    const { q } = req.query;
    const trains = await Train.find({
      $or: [
        { trainName: { $regex: q, $options: 'i' } },
        { trainNumber: { $regex: q, $options: 'i' } }
      ]
    });
    res.json(trains);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTrainById = async (req, res) => {
  try {
    const train = await Train.findOne({ trainNumber: req.params.id });
    if (train) {
      res.json(train);
    } else {
      res.status(404).json({ message: 'Train not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTrainStatus = async (req, res) => {
  try {
    const train = await Train.findOne({ trainNumber: req.params.id });
    if (!train) return res.status(404).json({ message: 'Train not found' });

    // Step 1: Try Real-Time API Status
    let liveStatus = null;
    try {
      liveStatus = await rapidApiService.getLiveTrainStatus(train.trainNumber);
    } catch (err) {
      console.error("API Status Error:", err.message);
    }

    if (liveStatus) {
      return res.json({
        trainNumber: train.trainNumber,
        currentStation: liveStatus.CurrentStation?.StationName || "Unknown",
        nextStation: "Check Live Status",
        status: liveStatus.Status || "Live",
        delay: liveStatus.Delay || 0,
        lastUpdated: new Date().toISOString(),
        prediction: { predicted_delay_minutes: liveStatus.Delay || 0 }
      });
    }

    // Fallback: Simulated Status Logic + ML Prediction
    const now = new Date();
    const currentHour = now.getHours();
    const stationIndex = currentHour % train.routeStations.length;
    const currentStation = train.routeStations[stationIndex];
    const nextStation = train.routeStations[(stationIndex + 1) % train.routeStations.length];

    let prediction = { predicted_delay_minutes: 0, confidence_score: 0 };
    try {
      const mlResponse = await axios.post(`${process.env.ML_SERVICE_URL}/predict-delay`, {
        train_number: train.trainNumber,
        station_code: currentStation.stationCode,
        day_of_week: now.getDay(),
        month: now.getMonth() + 1,
        is_holiday: 0,
        scheduled_arrival_hour: parseInt(currentStation.scheduledArrivalTime.split(':')[0]),
        weather: "Clear"
      });
      prediction = mlResponse.data;
    } catch (mlErr) {
      console.error("ML Service Error:", mlErr.message);
    }

    res.json({
      trainNumber: train.trainNumber,
      currentStation: currentStation.stationName,
      nextStation: nextStation.stationName,
      status: prediction.predicted_delay_minutes > 15 ? "Delayed" : "On Time",
      delay: prediction.predicted_delay_minutes,
      lastUpdated: now.toISOString(),
      prediction: prediction
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rapidApiService = require('../services/rapidApiService');

exports.searchByRoute = async (req, res) => {
  try {
    let { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ message: 'Both from and to stations are required' });

    // Step 1: Resolve station codes (standardize to CODES)
    const resolveStation = async (input) => {
      let s = await Station.findOne({ stationCode: input.toUpperCase() });
      if (!s) s = await Station.findOne({ stationName: { $regex: new RegExp(`^${input}$`, 'i') } });
      if (!s) s = await Station.findOne({ stationName: { $regex: input, $options: 'i' } });
      return s ? s.stationCode : input.toUpperCase();
    };

    const fromCode = await resolveStation(from);
    const toCode = await resolveStation(to);

    // Step 2: Try Real-Time API (RapidAPI)
    let realTimeResults = null;
    try {
      realTimeResults = await rapidApiService.searchTrains(fromCode, toCode);
    } catch (err) {
      console.error("RapidAPI Failure, falling back to local DB");
    }

    if (realTimeResults && realTimeResults.length > 0) {
      return res.json(realTimeResults);
    }

    // Step 3: Fallback to Local MongoDB Search
    const directTrains = await Train.find({
      $and: [
        { 'routeStations.stationCode': fromCode },
        { 'routeStations.stationCode': toCode }
      ]
    });


    const validatedDirect = directTrains.filter(train => {
      const fromIndex = train.routeStations.findIndex(s => s.stationCode === fromCode);
      const toIndex = train.routeStations.findIndex(s => s.stationCode === toCode);
      return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
    });

    // 2. Find INDIRECT trains (Connections)
    // We only do this if no direct trains found OR as an enhancement
    let connections = [];
    if (validatedDirect.length < 3) { // Threshold for showing connections
      // Find all trains from Source
      const trainsFromSource = await Train.find({ 'routeStations.stationCode': fromCode });
      // Find all trains to Destination
      const trainsToDest = await Train.find({ 'routeStations.stationCode': toCode });

      for (const t1 of trainsFromSource) {
        const fromIdx = t1.routeStations.findIndex(s => s.stationCode === fromCode);
        // Candidate intersection stations on T1 after 'from'
        const candidateIntersections = t1.routeStations.slice(fromIdx + 1);

        for (const t2 of trainsToDest) {
          if (t1.trainNumber === t2.trainNumber) continue; // Same train doesn't count as connection

          const toIdx = t2.routeStations.findIndex(s => s.stationCode === toCode);
          // Candidate intersection stations on T2 before 'to'
          const candidateStarts = t2.routeStations.slice(0, toIdx);

          // Find common station
          for (const s1 of candidateIntersections) {
            const s2 = candidateStarts.find(s => s.stationCode === s1.stationCode);
            if (s2) {
              // Valid connection found at station s1.stationCode
              // Check timings: T1 arrival at X < T2 departure from X
              const [aH, aM] = s1.scheduledArrivalTime.split(':').map(Number);
              const [dH, dM] = s2.scheduledDepartureTime.split(':').map(Number);
              const arrivalVal = aH * 60 + aM;
              const departureVal = dH * 60 + dM;

              if (departureVal > arrivalVal + 30) { // At least 30 mins to change
                connections.push({
                  type: 'connection',
                  connectionStation: s1.stationName,
                  train1: t1,
                  train2: t2,
                  totalDuration: "Calculated Journey",
                  departureTime: t1.routeStations[fromIdx].scheduledArrivalTime,
                  arrivalTime: t2.routeStations[toIdx].scheduledArrivalTime
                });
                break; // Found one connection for this pair of trains
              }
            }
          }
          if (connections.length > 5) break; // Limit results
        }
        if (connections.length > 5) break;
      }
    }

    res.json([...validatedDirect, ...connections]);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getTrainsAtStation = async (req, res) => {
  try {
    const { station } = req.params;
    if (!station) return res.status(400).json({ message: 'Station name or code is required' });

    // Step 1: Resolve station code
    const resolveStation = async (input) => {
      let s = await Station.findOne({ stationCode: input.toUpperCase() });
      if (!s) s = await Station.findOne({ stationName: { $regex: new RegExp(`^${input}$`, 'i') } });
      if (!s) s = await Station.findOne({ stationName: { $regex: input, $options: 'i' } });
      return s ? s.stationCode : input.toUpperCase();
    };

    const stationCode = await resolveStation(station);

    // Step 2: Try Real-Time API (RapidAPI)
    let realTimeResults = null;
    try {
      realTimeResults = await rapidApiService.getTrainsAtStation(stationCode);
    } catch (err) {
      console.error("RapidAPI Error (getLiveStation) fallback to local:", err.message);
    }

    if (realTimeResults && realTimeResults.length > 0) {
      return res.json(realTimeResults);
    }

    // Step 3: Fallback to Local Search
    const trains = await Train.find({
      'routeStations.stationCode': stationCode
    });

    // Format local results to match expected structure
    const formattedLocal = trains.map(t => {
      const stationData = t.routeStations.find(s => s.stationCode === stationCode);
      return {
        ...t.toObject(),
        stationContext: {
          arrival: stationData?.scheduledArrivalTime,
          departure: stationData?.scheduledDepartureTime,
          platform: 'TBA',
          delay: '0'
        }
      };
    });

    res.json(formattedLocal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
