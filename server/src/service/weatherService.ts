import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  description: string;
  temp: number;
  humidity: number;
  wind: number;

  constructor(city: string, date: string, description: string, temp: number, humidity: number, wind: number) {
    this.city = city;
    this.date = date;
    this.description = description;
    this.temp = temp;
    this.humidity = humidity;
    this.wind = wind;
  }
}

const apiKey = '9209de092d550f4a2902a7822c943d60';

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string = process.env.API_BASE_URL || 'https://api.openweathermap.org';
  private apiKey: string = process.env.API_KEY || apiKey;
  private cityName: string = '';

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    return await response.json();
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData[0]);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    return await response.json();
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const currentWeather = response;
    return new Weather(
      this.cityName,
      new Date(currentWeather.dt * 1000).toLocaleDateString(),
      currentWeather.weather[0].description,
      currentWeather.main.temp,
      currentWeather.main.humidity,
      currentWeather.wind.speed
    );
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]) {
    const forecastArray = [];
    for (let i = 0; i < weatherData.length; i += 8) {
      forecastArray.push(
        new Weather(
          this.cityName,
          weatherData[i].dt_txt,
          weatherData[i].weather[0].description,
          weatherData[i].main.temp,
          weatherData[i].main.humidity,
          weatherData[i].wind.speed
        )
      );
    }
    return forecastArray;
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData.list[0]);
    const forecastArray = this.buildForecastArray(weatherData.list);
    return { currentWeather, forecastArray };
  }
}

export default new WeatherService();
