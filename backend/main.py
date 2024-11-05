# Filename: main.py
#
# Description: This script implements the FastAPI back-end for the project application.
#
# Author: John Iliadis - 104010553

import fastapi
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from pydantic import BaseModel, Field, field_validator, ValidationInfo
from typing import Optional
from model import get_model, make_prediction
from datetime import date
from utils import trace_exception, get_logger
from states import *
import json
import requests


class HousePricePredictionModelInput(BaseModel):
    """Pydantic model used for validating the input data. This class also processes the data into an appropriate
    format for the model."""
    state: str = Field(..., description='American state')
    city: str = Field(..., description='City of state')
    beds: int = Field(..., gt=0, description='Number of beds')
    baths: int = Field(..., gt=0, description='Number of baths')
    living_area: float = Field(..., gt=0, description='Living area in square meters')
    land_area: float = Field(..., gt=0, description='Total land area in square meters')
    sold: bool = Field(..., description='Flag that states if the property has ever been sold')
    prev_sold_date: Optional[date] = Field(None, description='Previously sold date')

    @field_validator('state', 'city')
    def check_empty_string(cls, string_input: str) -> str:
        """Validator makes sure that the 'state' and 'city' fields are not empty."""
        if string_input.strip() == '':
            raise ValueError('String is empty')
        return string_input

    @field_validator('state')
    def check_valid_state(cls, string_input: str) -> str:
        """Validator that checks if the 'state' input is a valid U.S. state."""
        if string_input.title() not in STATES:
            raise ValueError(f'{string_input} is not a valid U.S. state')
        return string_input

    @field_validator('prev_sold_date')
    def validate_sold_date(cls, date_input: Optional[date], info: ValidationInfo) -> date:
        """Validator for the 'prev_sold_date' field. Checks three things:
               - If the property has been sold, ensures that the sold date is not null
               - If the property has been sold, ensures that the sold date is not a future date
               - If the property has not been sold, ensures that the sold date is null"""
        if info.data['sold']:
            if date_input is None:
                raise ValueError('The property has been sold, but the sold date has not been set.')
            elif date_input > date.today():
                raise ValueError("The sold date is a future date.")
        elif date_input is not None:
            raise ValueError('The property has not been sold, but the sold date has been set.')
        return date_input

    @trace_exception
    def years_since_last_sold(self) -> int:
        """Calculates the number of years since the property was last sold."""
        if self.sold is False:
            return 0

        current_date = date.today()
        difference = current_date - self.prev_sold_date
        return difference.days // 365

    @trace_exception
    def encode_state_value(self) -> float:
        """Returns the encoded value for the state."""
        return get_encoded_state_value(self.state)

    @trace_exception
    def encode_city_value(self) -> float:
        """Returns the encoded value for the city. If the city is not found in the stored values, the encoded value
        for the state will be returned instead. This won't affect the performance much because target encoding was
        used, and the city is related to the state."""
        global city_state_encoded_data_mappings
        if self.city.lower() in city_state_encoded_data_mappings[self.state.lower()]:
            encoded_city_value = city_state_encoded_data_mappings[self.state.lower()][
                self.city.lower()]['encoded_value']
            return encoded_city_value
        else:
            return self.encode_state_value()

    @trace_exception
    def get_processed_input(self) -> dict:
        """Returns all the values in the correct order and format for the model prediction."""
        return {
            'beds': self.beds,
            'baths': self.baths,
            'living_area': self.living_area,
            'land_area': self.land_area,
            'years_since_last_sold': self.years_since_last_sold(),
            'state_encoded': self.encode_state_value(),
            'city_encoded': self.encode_city_value()
        }

    def getPropertyDetails(self) -> dict:
        """Returns the inputted property details."""
        return {
            'state': self.state,
            'city': self.city,
            'beds': self.beds,
            'baths': self.baths,
            'living-area': self.living_area,
            'land-area': self.land_area,
            'sold': self.sold,
            'sold_date': self.prev_sold_date,
            'years_since_last_sold': self.years_since_last_sold()
        }


app = fastapi.FastAPI()
model = get_model()
logger = get_logger()
city_state_encoded_data_mappings = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # allow only requests originating from the React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event('startup')
async def load_city_state_encoded_data():
    """Loads the encoded data mappings from data processing on app startup. These are required for transforming the
    input data into the correct format for the model."""
    global city_state_encoded_data_mappings
    try:
        with open('model/state_city_encoded_values.json', 'r') as json_file:
            city_state_encoded_data_mappings = json.load(json_file)
    except Exception as e:
        logger.error(f'Failed to read state_city_encoded_values.json: {str(e)}')
        raise HTTPException(status_code=500, detail='Failed to read a core app file on startup')


@app.post('/predict')
async def predict_house_price(user_input: HousePricePredictionModelInput):
    """Post method used for making a price prediction on a property, given the property's details."""
    try:
        return {'result': get_result_data(user_input)}
    except Exception as e:
        logger.error(f'Error occurred in predict_house_price(): {str(e)}')
        raise HTTPException(status_code=500, detail="Internal server error")


RAPID_API_URL = "https://zillow56.p.rapidapi.com/search_address"
RAPID_API_HEADERS = {
    "x-rapidapi-key": "7fe6ede6dcmsha5ef7a4b1eb6781p1d1f25jsn2cbe369ca4b7",
    "x-rapidapi-host": "zillow56.p.rapidapi.com"
}


@trace_exception
def fetch_rapid_api_house_data(address: str):
    """
    Rapid API is used for fetching property data from listings on Zillow.com.

    Args:
        address: (str): The american address of a property in the format of 'street, city, state'.
    """
    logger.debug(f'Rapid API call attempt with address: {address}')
    response = requests.get(url=RAPID_API_URL, headers=RAPID_API_HEADERS, params={'address': address}, timeout=5)

    if response.status_code != 200:
        logger.error(f'Failed to fetch data from Rapid API: Response status code: {response.status_code}')
        raise RuntimeError('Failed to fetch data from Rapid API')

    return response.json()


@app.get('/predict/{street}/{city}/{state}')
async def predict_house_price(street: str, city: str, state: str):
    """Get request function used for making a price prediction on a property, based on the property's address. Rapid
    API is used to fetch the data required for the model. This method is used for when the user doesn't know the
    property's specific details, but knows the property address."""
    address = f'{street} {city} {state}'
    house_data = fetch_rapid_api_house_data(address)

    try:
        living_area = house_data['livingArea'] * 0.09290304  # convert from square feet to square meters
        land_area = house_data['lotSize'] * 0.09290304  # convert from square feet to square meters
        sold = True
        date_sold = house_data['dateSoldString']

        # if date_sold is empty, house hasn't been sold yet
        if date_sold == '':
            sold = False
            date_sold = None

        user_input = HousePricePredictionModelInput(
            state=state,
            city=city,
            beds=house_data['bedrooms'],
            baths=house_data['bathrooms'],
            living_area=living_area,
            land_area=land_area,
            sold=sold,
            prev_sold_date=date_sold
        )

        return {'result': get_result_data(user_input)}
    except Exception as e:
        logger.error(f'Error occurred in predict_house_price(): {str(e)}')
        raise HTTPException(status_code=500, detail='Internal server error')


@trace_exception
def get_result_data(user_input: HousePricePredictionModelInput) -> dict:
    """Calculates and returns all the data needed for the visualizations."""
    return {
        'prediction': make_prediction(model, user_input.get_processed_input()),
        'property-details': user_input.getPropertyDetails(),
        'choropleth-chart-data': get_choropleth_chart_data(user_input),
        'bar-chart-data': get_bar_chart_data(user_input),
        'line-chart-data': get_line_chart_data(user_input)
    }


@trace_exception
def get_choropleth_chart_data(user_input: HousePricePredictionModelInput) -> list:
    """Calculates the data required for the US state choropleth chart. It returns a
    list of dictionaries in the following format:

    [
      {"state": "Massachusetts", "price": 345151},
      {"state": "Connecticut", "price": 294903},
        ...
    ]
    """
    data = user_input.get_processed_input()
    result = []

    # get a price prediction for every state
    for state in STATES:
        data['state_encoded'] = get_encoded_state_value(state)
        result.append({
            'state': state,
            'price': make_prediction(model, data)
        })

    return result


@trace_exception
def get_bar_chart_data(user_input: HousePricePredictionModelInput) -> list:
    """Calculates the data required for the bar chart. It returns a list of
    dictionaries in the following format:

    [
      {"city": "fort payne", "price": 203386},
      {"city": "valley head",  "price": 176204},
        ...
    ]
    """

    state = user_input.state
    data = user_input.get_processed_input()
    inputted_city_name = user_input.city.title()
    result = []

    # get a price prediction for every city in the inputted state
    inputted_city_added = False
    for city in city_state_encoded_data_mappings[state.lower()]['cities']:
        data['city_encoded'] = city['encoded_value']
        city_name = city['city_name'].title()

        if inputted_city_name == city_name:
            inputted_city_added = True

        result.append({
            'city': city_name,
            'price': make_prediction(model, data)
        })

    # if the inputted city isn't included in the dataset, it won't be in the encoded mappings so we have to add it here
    if not inputted_city_added:
        result.append({
            'city': inputted_city_name,
            'price': make_prediction(model, user_input.get_processed_input())
        })

    return result


@trace_exception
def get_line_chart_data(user_input: HousePricePredictionModelInput) -> dict:
    """Calculates the data required for the line chart. It returns two lists of
    dictionaries in the following format:

    {
      "living-area-prices": [{"living_area": 100, "price": 145908}, ...],
      "land-area-prices": [{"land_area": 500, "price": 255970}, ...]
    }
    """

    data_living_area = user_input.get_processed_input()
    data_land_area = user_input.get_processed_input()
    living_area = user_input.living_area
    land_area = user_input.land_area
    result_living_area = []
    result_land_area = []

    # calculates the price of the property depending on the land and living areas.
    # The area will range from 50% to 150% of the inputted area in 10% intervals.
    percent = 50
    for i in range(11):
        data_living_area['living_area'] = living_area * percent / 100
        data_land_area['land_area'] = land_area * percent / 100

        result_living_area.append({
            'living_area': int(data_living_area['living_area']),
            'price': make_prediction(model, data_living_area)
        })

        result_land_area.append({
            'land_area': int(data_land_area['land_area']),
            'price': make_prediction(model, data_land_area)
        })

        percent += 10

    return {
        'living-area-prices': result_living_area,
        'land-area-prices': result_land_area
    }


@trace_exception
def get_encoded_state_value(state: str):
    """Returns the encoded value for the state. The encoded mappings from data processing have been stored
    in the 'city_state_encoded_data_mappings' json file."""
    encoded_state_value = city_state_encoded_data_mappings[state.lower()]['encoded_value']
    return encoded_state_value


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)