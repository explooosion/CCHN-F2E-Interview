import axios from 'axios';

import { FETCH_CARS, FETCH_CARS_SUCCESS, FETCH_CARS_ERROR } from '../reducers/cars';

const URL = './api/cars.csv';

/**
 * FETCH CARS
 */
export const getCars = () => async dispatch => {
  await dispatch({ type: FETCH_CARS });
  await axios
    .get(URL)
    .then(res => dispatch({ type: FETCH_CARS_SUCCESS, payload: res.data }))
    .catch(res => dispatch({ type: FETCH_CARS_ERROR, payload: res }))
}
