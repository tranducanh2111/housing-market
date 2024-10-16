import pickle
from sklearn.linear_model import LinearRegression
from utils import error_handler


# todo: add comment
@error_handler
def get_model() -> LinearRegression:
    model_bin = open('model/linear_regression_model.pkl', 'rb')
    model = pickle.load(model_bin)
    return model


# todo: add comment
@error_handler
def make_prediction(model: LinearRegression, prediction_data: dict) -> float:
    X = list(prediction_data.values())
    prediction = model.predict([X])
    return prediction[0]
