# Setup
## Backend
1. Setup a python environment for this project (I used VSCode + `pyenv`).
2. In the python environment, run the following `pip` commands:
- `pip install scikit-learn`
- `pip install fastapi uvicorn`
- `pip install requests`
## Frontend
1. Install `npm`.
2. Open a terminal and navigate to the `frontend` folder.
3. Run the following `npm` commands:
- `npm install swiper`
- `npm install react-router-dom`
- `npm install react-phone-input-2`
- `npm install --save-dev prettier`
- `npm install -D tailwindcss`
- `npm install -D postcss`
- `npm install -D autoprefixer`
- `npm install axios`
# Execution
## Backend
To run the backend:
1. Create a terminal instance in the `backend` folder.
2. Either:
- Start a `uvicorn` web server of `main.py` with: `uvicorn main:app --reload`
- Run `main.py` directly. This also starts a `uvicorn` server.
## Frontend
To run the frontend, run the following from the `frontend` folder: `npm run start`
# Misc
## Formatting
To format the frontend code you can run `npm run format` from the `frontend` folder.