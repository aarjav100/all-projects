/**
 * Centralized API Service for communicating with the Python FastAPI backend.
 * Handles fetch logic, base URLs, and error states.
 */

const API_BASE_URL = 'http://localhost:8000/api';

export const TradingAPI = {
  
  /**
   * Fetches the latest global prediction, confidence parameters, and the exact pattern.
   * Useful for initializing the SignalBadge, LivePriceTicker, and Forecast views.
   */
  async getLatestPrediction() {
    try {
      const response = await fetch(`${API_BASE_URL}/prediction`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error("Error fetching latest prediction:", error);
      throw error;
    }
  },

  /**
   * Fetches historical real prices alongside forward ML predictions.
   * Useful for rendering the main PredictionChart trace.
   */
  async getChartData() {
    try {
      const response = await fetch(`${API_BASE_URL}/chart-data`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error("Error fetching chart data:", error);
      throw error;
    }
  }

};
