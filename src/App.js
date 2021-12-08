import { createStore } from 'redux'
import { Provider, useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from 'react';
import './App.css';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";

// Actions
function addTrip(trip) {
  return { type: 'ADD_TRIP', trip: trip, id: Math.random() };
}

function removeTrip(id) {
  return { type: "REMOVE_TRIP", id: id };
}

const reducer = (state = { trips:[] }, action) => {
  switch (action.type) {
    case 'ADD_TRIP': 
      console.log(action)
      return { // returning a copy of orignal state 
      ...state, //copying the original state
      trips: [...state.trips, { trip: action.trip, id: action.id }],
      }
      case "REMOVE_TRIP":
        const newTrip = state.trips.filter(trip => trip.id !== action.id);
        console.log(action)
        return {
          ...state,
          trips: newTrip
        }
      default: return state;
  }
}


function Trips() {
  // haetaan tietoa storesta
  const trips = useSelector(state => state.trips)
  const dispatch = useDispatch()
  const remove = (id) => {
  dispatch(removeTrip(id))
  }
  
  const history = useHistory();

  const handleTotal = () => {
    history.push('/total')
  }

  const handleCalc = () => {
    history.push('/')
  }


  return(
    <div>
        <Banner />
        <button onClick={() => handleTotal() }>Show total/avg</button>
        <button onClick={() => handleCalc() }>Add trip</button>
        {trips.map(trip => (
          <div className="totalinfo" key={trip.id}>
            <hr></hr>
            <li>
              <table className="infotable">
                <tr>
                  <td>Date: {trip.trip.date}</td>
                  <td><button className="totalbutton" onClick={() => remove(trip.id)}> x </button></td>
                </tr>
                <tr>
                  <td>Cost: {(trip.trip.cost).toFixed(2)} €</td>
                  <td>Price per litre: {trip.trip.price} €</td>
                </tr>
                <tr>
                  <td>Lenght: {trip.trip.km} km</td>
                  <td>Consumption: {(trip.trip.consumpt).toFixed(2)} litres</td>
                </tr>
              </table>
            </li>
            <hr></hr>
          </div>
        ))}
    </div>
  )
}


function Calculator() {
  const dispatch = useDispatch()

  const [date, setDate] = useState()
  const [km, setKm] = useState(0)
  const [price, setPrice] = useState(0)
  const [refueled, setRefueled] = useState(0)
  const [cost, setCost] = useState(0)
  const [consumpt, setConsumpt] = useState(0)

 useEffect(() => {
   setCost(price*refueled)
   setConsumpt(refueled/km*100)
 })

  const history = useHistory();

  const handleTotal = () => {
    history.push('/total')
  }

  const handleLog = () => {
    history.push('/trips')
  }

  return(
    <div>
      <Banner />
      <table>
        <tr>
          <td>Date</td>
          <td><input type="date" onChange={event => setDate(event.target.value)}></input></td>
        </tr>
        <tr>
          <td>Car kilometers</td>
          <td><input placeholder="-" onChange={event => setKm(event.target.value)}></input></td>
        </tr>
        <tr>
          <td>Refueled liters</td>
          <td><input placeholder="-" onChange={event => setRefueled(event.target.value)}></input></td>
        </tr>
        <tr>
          <td>Price per litre</td>
          <td><input placeholder="-" onChange={event => setPrice(event.target.value)}></input></td>
        </tr>
        <tr>
          <td>Cost</td>
          <td><input placeholder="-" value={(cost).toFixed(2)+" €"} readOnly></input></td>
        </tr>
        <tr>
          <td>Consumption L/100km</td>
          <td><input placeholder="-" value={(consumpt).toFixed(2)} readOnly></input></td>
        </tr>
      </table>
      <br></br>
      <button onClick={() => dispatch(addTrip({km, date, consumpt, cost, price}))}>Add trip</button>
      <button onClick={() => handleTotal() }>Show total/avg</button>
      <button onClick={() => handleLog() }>Trip log</button>
    </div>

  )
}

function Total() {
  const history = useHistory();
  const trips = useSelector(state => state.trips)

  // calculating km sum from shop
  const total = trips.reduce((prev, current) => {
    return prev + parseInt(current.trip.km);
  }, 0);

  // calculating consumption from shop
  const consumpt = trips.reduce((prev, current) => {
    return prev + parseInt(current.trip.consumpt);
  }, 0);
  const avgConsumpt = (consumpt/total*100).toFixed(2)

  const data = [{name: '1', uv: 5, pv: 2400, amt: 2400}, {name:'2', uv: 6}, {name:'3', uv: 5}];

  // Rechart
  const renderLineChart = (
    <LineChart width={570} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="name" />
      <YAxis />
    </LineChart>
  );

  const handleLog = () => {
    history.push('/trips')
  }

  const handleCalc = () => {
    history.push('/')
  }

  return(
    <div>
      <Banner />
      <button onClick={() => handleCalc() }>Add trip</button>
      <button onClick={() => handleLog() }>Trip log</button>
      <p>Total kilometers: {total} km</p>
      <p>Avg consumption: {avgConsumpt}</p>
      {renderLineChart}
    </div>
  )
}

function Banner() {
  return(
    <h1>Car Consumption</h1>
  )
}


function App() {

  const store = createStore(reducer)

  return (
    <Router>
      <Switch>
        <Provider store={store}>
        <Route exact path="/"><Calculator /></Route>
        <Route path="/total"><Total /></Route>
        <Route path="/trips"><Trips /></Route>
        </Provider>
      </Switch>
  </Router>
  );
}

export default App;
