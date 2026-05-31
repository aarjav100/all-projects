const axios = require('axios');

/**
 * RailAPI Service using indianrailapi.com
 * Maps real-world data to the application's internal format
 */
class RailApiService {
  constructor() {
    this.apiKey = process.env.INDIANRAILAPI_KEY;
    this.baseUrl = `http://indianrailapi.com/api/v2`;
  }

  /**
   * Fetch Live Train Status
   */
  async getLiveTrainStatus(trainNumber) {
    if (!this.apiKey || this.apiKey === 'YOUR_API_KEY_HERE') return null;

    try {
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      console.log(`Calling IndianRailAPI for status: ${trainNumber} on ${today}`);
      const url = `${this.baseUrl}/livetrainstatus/apikey/${this.apiKey}/trainnumber/${trainNumber}/date/${today}/`;
      const response = await axios.get(url);

      if (response.data && response.data.ResponseCode === "200") {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("IndianRailAPI Error (livetrainstatus):", error.message);
      return null;
    }
  }

  /**
   * Fetch Trains Passing Through Station (Live Station)
   */
  async getTrainsAtStation(stationCode) {
    if (!this.apiKey || this.apiKey === 'YOUR_API_KEY_HERE') return null;

    try {
      console.log(`Calling IndianRailAPI for live station: ${stationCode}`);
      const url = `${this.baseUrl}/LiveStation/apikey/${this.apiKey}/StationCode/${stationCode.toUpperCase()}/hours/4/`;
      const response = await axios.get(url);

      if (response.data && response.data.ResponseCode === "200" && response.data.Trains) {
        return this.mapStationToInternal(response.data.Trains, stationCode);
      }
      return null;
    } catch (error) {
      console.error("IndianRailAPI Error (LiveStation):", error.message);
      return null;
    }
  }

  /**
   * Maps IndianRailAPI LiveStation results to internal Train schema
   */
  mapStationToInternal(apiTrains, contextStation) {
    return apiTrains.map(t => ({
      trainNumber: t.TrainNumber,
      trainName: t.TrainName,
      source: t.Source,
      destination: t.Destination,
      type: t.TrainType || 'Express',
      isRealTime: true,
      stationContext: {
        arrival: t.ScheduleArrival,
        departure: t.ScheduleDeparture,
        eta: t.ActualArrival,
        etd: t.ActualDeparture,
        delay: t.DelayArrival || '0',
        platform: t.Platform || 'TBA'
      },
      routeStations: [
        {
          stationCode: contextStation.toUpperCase(),
          stationName: contextStation,
          scheduledArrivalTime: t.ScheduleArrival,
          scheduledDepartureTime: t.ScheduleDeparture,
          day: 1
        }
      ]
    }));
  }

  /**
   * Fetch Trains Between Stations
   */
  async searchTrains(fromCode, toCode) {
    if (!this.apiKey || this.apiKey === 'YOUR_API_KEY_HERE') return null;

    try {
      console.log(`Calling IndianRailAPI for route: ${fromCode} -> ${toCode}`);
      const url = `${this.baseUrl}/TrainBetweenStation/apikey/${this.apiKey}/From/${fromCode.toUpperCase()}/To/${toCode.toUpperCase()}/`;
      const response = await axios.get(url);

      if (response.data && response.data.ResponseCode === "200" && response.data.Trains) {
        return this.mapSearchToInternal(response.data.Trains);
      }
      return null;
    } catch (error) {
      console.error("IndianRailAPI Error (TrainBetweenStation):", error.message);
      return null;
    }
  }

  /**
   * Maps IndianRailAPI TrainBetweenStation results to internal Train schema
   */
  mapSearchToInternal(apiTrains) {
    return apiTrains.map(t => ({
      trainNumber: t.TrainNo,
      trainName: t.TrainName,
      source: t.Source,
      destination: t.Destination,
      type: t.TrainType || 'Express',
      isRealTime: true,
      routeStations: [
        {
          stationCode: t.Source,
          stationName: t.Source,
          scheduledArrivalTime: t.ArrivalTime || '--:--',
          scheduledDepartureTime: t.DepartureTime || '--:--',
          day: 1
        },
        {
          stationCode: t.Destination,
          stationName: t.Destination,
          scheduledArrivalTime: t.ArrivalTime || '--:--',
          scheduledDepartureTime: t.ArrivalTime || '--:--',
          day: 1
        }
      ],
      totalDistance: parseInt(t.TravelTime?.split(':')[0]) * 60 || 0
    }));
  }
}

module.exports = new RailApiService();
