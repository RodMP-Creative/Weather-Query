// TODO: Define a City class with name and id properties
class City {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

import * as fs from 'fs';
import * as path from 'path';

// TODO: Complete the HistoryService class
class HistoryService {
  private filePath = path.join(path.dirname(new URL(import.meta.url).pathname), 'searchHistory.json');

  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.filePath, JSON.stringify(cities), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    const cities = await this.read();
    return cities.map((city: any) => new City(city.id, city.name));
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string): Promise<void> {
    const cities = await this.getCities();
    const newCity = new City(cities.length + 1, city);
    cities.push(newCity);
    await this.write(cities);
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
 
}

export default new HistoryService();
