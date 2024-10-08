import dotenv from 'dotenv';
import dayjs, { type Dayjs } from 'dayjs';
/* import { response } from 'express'; */
dotenv.config();


// TODO: Define an interface for the Coordinates object
 
interface Coordinates {
  name: string;
  country: string;
  state: string;
  lat: string;
  lon: string;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: Dayjs | string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescr: string;

  constructor (
    city: string,
    date: Dayjs | string,
    temperature: number,
    windSpeed: number,
    humidity: number,
    icon: string,
    iconDescr: string
  ) {
    this.city = city;
    this.date = date;
    this.tempF = temperature;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescr = iconDescr;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  
  private baseURL: string;
  private apiKey: string;
  private city:any = '';
 
  constructor() {
    this.baseURL = process.env.BASE_URL || 'https://api.openweathermap.org'; // BASE_URL can be inside .env file. IMPORTANT !!!!!!!!!!!!
    this.apiKey = process.env.API_KEY || 'enter your api key here or create .env file with BASE_URL & API_KEY'; // IMPORTANT !!!!!!!!!!!
  }
  
  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
 private async fetchLocationData(query: string) {
  try {
    if (!this.baseURL || !this.apiKey) {
      throw new Error('base URL or API key not found');
    }

    const response: Coordinates[] = await fetch(query).then((res) => res.json());
    /* console.log(`FETCH log ${JSON.stringify(response)}`); */
    return response[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
 }
 

  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  private destructureLocationData(locationData: Coordinates): Coordinates {
    if (!locationData) {
      throw new Error('City not found');
    }
    const { name, lat, lon, country, state} = locationData;
    const coordinates: Coordinates = {
      name,
      lat,
      lon,
      country,
      state,
    };
    /* console.log(`destructure ${JSON.stringify(coordinates)}`); */
    return coordinates;
  }

  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  private buildGeocodeQuery(): string {

    const geocodeQuery = `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.apiKey}`;
    return geocodeQuery;
  }

  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    /* console.log(`weather query ${JSON.stringify(weatherQuery)}`) */
    return weatherQuery;
  }

  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  private async fetchAndDestructureLocationData() {
    return await this.fetchLocationData(this.buildGeocodeQuery()).then((data) =>
      this.destructureLocationData(data));
  }


  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  private async fetchWeatherData(coordinates: Coordinates) {
    /* console.log(`Fetching weather data for: ${JSON.stringify(coordinates)}`); */
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates)).then(
        (res) => res.json()
      );
       console.log('response', JSON.stringify(response));
      if (!response) {
        throw new Error('Weather data not found');
      }

      const currentWeather: Weather = this.parseCurrentWeather(
        response.list[0]
      );

      const forecast: Weather[] = this.buildForecastArray(
        currentWeather,
        response.list
      );
      return forecast;
    } catch (error: any) {
      console.error(error);
      return error;
    }
  }

  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(response: any) {
    const parsedDate = dayjs.unix(response.dt).format('M/D/YYYY');
    const currentWeather = new Weather(
      this.city,
      parsedDate,
      response.main.temp,
      response.wind.speed,
      response.main.humidity,
      response.weather[0].icon,
      response.weather[0].description || response.weather[0].main
    );
    return currentWeather;
  }

  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const weatherForecast: Weather[] = [currentWeather];

    const filteredWeatherData = weatherData.filter((data: any) => {
      return data.dt_txt.includes('12:00:00');
    });

    for (const day of filteredWeatherData) {
      weatherForecast.push(
        new Weather(
          this.city,
          dayjs.unix(day.dt).format('M/D/YYYY'),
          day.main.temp,
          day.wind.speed,
          day.main.humidity,
          day.weather[0].icon,
          day.weather[0].description || day.weather[0].main
        )
      );
    }
    return weatherForecast; 
  }

  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  async getWeatherForCity(city: string) {
    try {
      this.city = city;
      const coordinates = await this.fetchAndDestructureLocationData();
      /* console.log(`get weather for city log ${JSON.stringify(coordinates)}`); */
      if (coordinates) {
        const weather = await this.fetchWeatherData(coordinates);
        return weather;
      }

      throw new Error('Weather data not found');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new WeatherService();


/* fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=vinnytsia&units=metric&APPID=de3f633e7310a3e13075ec4bab6365c6`
)
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err)); */
