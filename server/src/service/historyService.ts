import fs from 'node:fs/promises';
/* import { parse } from 'node:path';
import path from 'path'; */
import { v4 as uuidv4 } from 'uuid';


// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor (
    name: string,
    id: string
  )
  {
    this.name = name;
    this.id = id;
  }
}



// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  // private async read() {}
  private async read() {
    const data = await fs.readFile('src/routes/api/history/searchHistory.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
    return data ? JSON.parse(data) : [];
  };
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}

  private async write(cities: City[]) {
     return await fs.writeFile('src/routes/api/history/searchHistory.json', JSON.stringify(cities, null, '\t'));
  };
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}

  async getCities(): Promise<City[]> {
    const cities = await this.read();
    return Array.isArray(cities) ? cities : [];
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  async addCity(cityName: string): Promise<City | null> {
    if (!cityName) {
      throw new Error('City name cannot be blank');
    }

    const cities = await this.getCities();

    // Check if the city already exists
    if (cities.find((city) => city.name === cityName)) {
      return null; // City already exists, return null or handle appropriately
    }

    // Create a new city object with a unique id
    const newCity = new City(cityName, uuidv4());

    // Add the new city to the cities array and write the updated array
    cities.push(newCity);
    await this.write(cities);

    return newCity;
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}

  async removeCity(id: string) {
    return await this.getCities()
      .then((cities) => cities.filter((city) => city.id !== id))
      .then((filteredCities) => this.write(filteredCities));
  }
}

export default new HistoryService();

