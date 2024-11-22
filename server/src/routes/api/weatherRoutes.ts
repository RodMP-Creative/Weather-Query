import { Router, type Request, type Response } from 'express';
import WeatherService from '../../service/weatherService.js';
import HistoryService from '../../service/historyService.js';
const router = Router();

// import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const cityName = req.body.city;
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }
  // TODO: save city to search history
  try {
      const weatherData = await WeatherService.getWeatherForCity(cityName);
      await HistoryService.addCity(cityName);
      res.json(weatherData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
  return;
});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {});

export default router;
