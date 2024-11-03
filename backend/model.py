# Filename: main.py
#
# Description: This script contains the functions used for interacting with the trained model.
#
# Author: John Iliadis - 104010553


import pickle
from sklearn.linear_model import LinearRegression
from utils import trace_exception


@trace_exception
def get_model() -> LinearRegression:
    """Loads and returns a trained model instance."""
    model_bin = open('model/linear_regression_model.pkl', 'rb')
    model = pickle.load(model_bin)
    return model


@trace_exception
def make_prediction(model: LinearRegression, prediction_data: dict) -> int:
    """
    Makes the price prediction on a property.

    Args:
        model (LinearRegression): The trained model object
        prediction_data (dict): The required data for the prediction. The data should be ordered and formatted
        correctly, otherwise an error or faulty prediction will occur. The correct order is: beds, baths, living_area,
        land_area, years_since_last_sold, state_encoded, city_encoded.
    """
    X = list(prediction_data.values())
    prediction = model.predict([X])
    return int(prediction[0])
