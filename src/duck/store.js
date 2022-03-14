import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";
import { authReducers } from "./auth";

const reducers = combineReducers({
  auth: authReducers,
});

const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const usuario = JSON.parse(localStorage.getItem("usuario")) || {
  isAuthenticated: false,
};

const initialState = {
  auth: usuario,
};

const store = createStore(
  reducers,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
);

export { store };
