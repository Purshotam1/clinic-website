import {createStore,applyMiddleware,combineReducers} from 'redux'
import { routerReducer } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import user from './reducers/user'


const rootReducer=combineReducers({user,router:routerReducer})
export default createStore(rootReducer,applyMiddleware(thunkMiddleware,logger))