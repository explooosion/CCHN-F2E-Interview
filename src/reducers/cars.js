import { csvToArray } from '../utils';

export const FETCH_CARS = 'FETCH_CARS';
export const FETCH_CARS_SUCCESS = 'FETCH_CARS_SUCCESS';
export const FETCH_CARS_ERROR = 'FETCH_CARS_ERROR';

const initialState = {
  datas: [],
  header: [],
  headerObj: {},
  loading: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CARS:
      return { ...state, loading: true };
    case FETCH_CARS_SUCCESS:
      return { ...state, loading: false, ...csvToArray(action.payload) };
    case FETCH_CARS_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
