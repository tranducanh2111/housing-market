import fastapi
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from pydantic import BaseModel, Field
from model import get_model, make_prediction
from datetime import date
from utils import error_handler, get_logger
import json
import requests


class HousePricePredictionModelInput(BaseModel):
    state: str = Field(..., description='American state')
    city: str = Field(..., description='City of state')
    beds: int = Field(..., gt=0, description='Number of beds')
    baths: int = Field(..., gt=0, description='Number of baths')
    living_area: float = Field(..., gt=0, description='Living area in square meters')
    land_area: float = Field(..., gt=0, description='Total land area in square meters')
    prev_sold_date: date = Field(..., description='Previously sold date')

    @error_handler
    def years_since_last_sold(self):
        current_date = date.today()
        difference = current_date - self.prev_sold_date
        return difference.days // 365

    # todo: error handling and comment
    @error_handler
    def encode_state_value(self) -> float:
        global city_state_encoded_data_mappings
        encoded_state_value = city_state_encoded_data_mappings[self.state.lower()]['encoded_value']
        return encoded_state_value

    # todo: add comment
    @error_handler
    def encode_city_value(self) -> float:
        global city_state_encoded_data_mappings
        if self.city.lower() in city_state_encoded_data_mappings[self.state.lower()]:
            encoded_city_value = city_state_encoded_data_mappings[self.state.lower()][self.city.lower()][
                'encoded_value']
            return encoded_city_value
        else:
            return self.encode_state_value()

    # todo: add comment
    def get_processed_input(self) -> dict:
        return {
            'beds': self.beds,
            'baths': self.baths,
            'living_area': self.living_area,
            'land_area': self.land_area,
            'years_since_last_sold': self.years_since_last_sold(),
            'state_encoded': self.encode_state_value(),
            'city_encoded': self.encode_city_value()
        }


app = fastapi.FastAPI()
model = get_model()
logger = get_logger()
city_state_encoded_data_mappings = {}

# todo: add comment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# todo: add comment
@app.on_event('startup')
async def load_city_state_encoded_data():
    global city_state_encoded_data_mappings
    with open('model/state_city_encoded_values.json', 'r') as json_file:
        city_state_encoded_data_mappings = json.load(json_file)


@app.post('/predict')
async def predict_house_price(input: HousePricePredictionModelInput):
    try:
        prediction = make_prediction(model, input.get_processed_input())
        return int(prediction)
    except Exception as e:
        logger.error(f'Error occurred in predict_house_price(): {str(e)}')
        raise HTTPException(status_code=500, detail="Internal server error")


RAPID_API_URL = "https://zillow56.p.rapidapi.com/search_address"
RAPID_API_HEADERS = {
    "x-rapidapi-key": "9863478a83msha7996ac4437a23cp15b609jsned259215371e",
    "x-rapidapi-host": "zillow56.p.rapidapi.com"
}


@error_handler
def fetch_rapid_api_house_data(address: str):
    response = requests.get(url=RAPID_API_URL, headers=RAPID_API_HEADERS, params={'address': address}, timeout=5)

    if response.status_code != 200:
        logger.error(f'Failed to fetch data from rapid api: Response status code: {response.status_code}')
        raise HTTPException(status_code=500, detail=f'Failed to fetch data from rapid api.')

    return response.json()


@app.get('/some_url/{street}/{city}/{state}')
async def predict_house_price(street: str, city: str, state: str):
    address = f'{street} {city} {state}'
    house_data = fetch_rapid_api_house_data(address)

    try:
        living_area = house_data['livingArea'] * 0.09290304  # convert from square feet to square meters
        land_area = house_data['lotSize'] * 0.09290304  # convert from square feet to square meters
        date_sold = house_data['dateSoldString']

        if date_sold == '':
            date_sold = date.today()  # house hasn't been sold yet

        model_input = HousePricePredictionModelInput(
            state=state,
            city=city,
            beds=house_data['bedrooms'],
            baths=house_data['bathrooms'],
            living_area=living_area,
            land_area=land_area,
            prev_sold_date=date_sold
        )

        prediction = make_prediction(model, model_input.get_processed_input())
        return int(prediction)
    except Exception as e:
        logger.error(f'Error occurred in predict_house_price() with get request: {str(e)}\n\tMost likely some'
                     f'Rapid API data was missing')
        raise HTTPException(status_code=500, detail='Internal server error')


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
