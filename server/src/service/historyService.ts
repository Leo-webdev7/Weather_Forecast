import fs from 'node:fs/promises';
/* import { parse } from 'node:path'; */
/* import path from 'path'; */
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
    await fs.readFile('src/routes/api/history/searchHistory.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
    /* ('api/history/searchHistory.json', 'utf8') */
  };
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}

  private async write(cities: City[]) {
    return await fs.writeFile('src/routes/api/history/searchHistory.json', JSON.stringify(cities, null, '\t'));
  };
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}

  async getCities() {
    return await this.read().then((cities: any) => {
      let parsedCities: City[] = [];

      // If cities isn't an array or can't be turned into one, send back a new empty array
      try {
        parsedCities = parsedCities.concat(JSON.parse(cities));
      } catch (err) {
        parsedCities = [];
      }
      return parsedCities;
    });
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}

  async addCity(city: string) {
    if (!city) {
      throw new Error('City cannot be blank');
    }

    // Add a unique id to the city using uuid package
    const newCity: City = { name: city, id: uuidv4() };

    // Get all cities, add the new city, write all the updated cities, return the newCity
    return await this.getCities()
      .then((cities) => {
        if (cities.find((index) => index.name === city)) {
          return cities;
        }
        return [...cities, newCity];
      })
      .then((updatedCities) => this.write(updatedCities))
      .then(() => newCity);

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

