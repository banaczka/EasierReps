import axios from 'axios';

const APP_ID = '27eb74ef';
const API_KEY = 'ee560da825879c1d23d6a8972832a452';
const BASE_URL = 'https://trackapi.nutritionix.com/v2';

export async function fetchCalories(item: string, quantity: number) {
    try {
      const response = await axios.post(`${BASE_URL}/natural/nutrients`, {
        query: `${quantity}g ${item}`,
      }, {
        headers: {
          'x-app-id': APP_ID,
          'x-app-key': API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.foods && response.data.foods.length > 0) {
        const calories = response.data.foods[0].nf_calories;
        return calories;
      } else {
        throw new Error('Nie znaleziono produktu');
      }
    } catch (error: any) {
      console.error('❌ Błąd pobierania kalorii:', error.message);
      throw new Error('Nie znaleziono produktu w bazie danych');
    }
  }