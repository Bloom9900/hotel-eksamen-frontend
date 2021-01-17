import React, { useEffect, useState } from 'react';
import apiFacade from './apiFacade';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt_decode from "jwt-decode";
import "./App.css";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    NavLink,
    useParams,
    useRouteMatch,
    Prompt,
  } from "react-router-dom";

export function SearchHotel() {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);

    function getHotels(event) {
        event.preventDefault();
        apiFacade.getHotels()
        .then(hotels => {
            hotels.map(hotel => hotel.name.toLowerCase());
            setResults(hotels.filter(hotel => hotel.name.toLowerCase().includes(search.toLowerCase())));
        })
    }

    const printResults = results.map(result => (
        <li key={result.id}>
            <h5>{result.name}</h5>
            <p>{result.content}</p>
            <hr/>
        </li>
    ))

    return (
        <div>
            <form onSubmit={getHotels}>
                <input type="text" placeholder="Search Hotels" onChange={event => setSearch(event.target.value)} />
                <button type="submit">Search</button>
            </form>
            <ul>
                {printResults}
            </ul>
        </div>
    )
}

export function Hotels({isLoggedIn}) {
    const [hotels, setHotels] = useState([]);
    const [hotel, setHotel] = useState({});
    const { path, url } = useRouteMatch();

    apiFacade.getHotels()
    .then(hotels => setHotels(hotels));

    const printHotels = hotels.map((hotel) => (
        <li key={hotel.id}>
            <h5>{hotel.name}</h5>
            <p>{hotel.content}</p>
            <NavLink onClick={() => setHotel(hotel)} to={`${url}/${hotel.id}`}>View Details</NavLink>
            <hr/>
        </li>  
    ))

    return (
        <div>
            <Switch>
            <Route exact path="/hotels">
                <h3>Hotels:</h3>
                <ul>
                    {printHotels}
                </ul>    
            </Route>
            <Route path={`${path}/:hotelId`}>
                <Hotel hotel={hotel} isLoggedIn={isLoggedIn} />
            </Route>
            </Switch>
        </div>
    )
}

function Hotel({hotel, isLoggedIn}) {
    let { hotelId } = useParams();
    const { path, url } = useRouteMatch();
    return (
        <div>
            <h3>{hotel.name}</h3>
            <p>{hotel.content}</p>
            <ul>
                <li>E-mail: {hotel.email}</li>
                <li>Phone: {hotel.phone}</li>
                <li>Price: {hotel.price}</li>
                <li>Website: {hotel.url}</li>
            </ul>
            <p>Directions to hotel: {hotel.directions}</p>

            {
                isLoggedIn &&
                (
                    <Reservation hotel={hotel} hotelId={hotelId} />
                )
            }
        </div>
    )
}

function Reservation({ hotel }) {
    const [value, onChange] = useState(new Date());
    const [reservation, setReservation] = useState({
        address: hotel.address,
        hotelName: hotel.name,
        hotelPhone: hotel.phone,
        hotelId: hotel.id,
        startDate: value
    });

    

    function handleChange(event) {
        const { id, value } = event.target;
        setReservation({ ...reservation, [id]: value })
    }

    function makeReservation(event) {
        event.preventDefault();
        console.log(reservation);
        apiFacade.makeBooking(reservation);
    }

    return (
        <div>
            <form onSubmit={makeReservation} onChange={handleChange}>
                <div>
                    <h5>Reservation Details: </h5>
                    <Calendar
                        id="startDate"
                        onChange={onChange}
                        value={value}
                    />
                    <label for="amountOfNights">Staying amount of nights:</label>
                    <input id="amountOfNights" type="number" />
                </div>
                <div>
                    <h5>Information/Payment Details: </h5>
                    <p>Login Credentials:</p>
                    <input id="username" type="text" placeholder="Username" />
                    <input id="password" type="password" placeholder="Password" />
                    <p>Cardholder name:</p>
                    <input id="Cardholder" type="text" placeholder="Cardholder name" />
                    <p>Phone number:</p>
                    <input id="phoneNumber" type="text" placeholder="Phone number" />
                    <p>Cardnumber:</p>
                    <input id="Cardnumber" type="number" placeholder="Cardnumber" />
                    <p>Type of card:</p>
                    <input id="Cardtype" type="radio" value="visa" /> Visa <br/>
                    <input id="Cardtype" type="radio" value="mastercard" /> Mastercard <br/>
                    <input id="Cardtype" type="radio" value="debit" /> Debit
                    <p>Month of Expiration:</p>
                    <input id="MonthOfExpiration" type="number" min="1" max="12" />
                    <p>Year of Expiration:</p>
                    <input id="YearOfExpiration" type="number" min="2020" max="2050" />
                    <input id="CVC" type="number" maxLength="6" placeholder="CVC" />
                    <button type="submit">Make Reservation</button>
                </div>
            </form>
        </div>
    )
}

export function Profile() {
    apiFacade.getBookings()
    .then(booking => console.log(booking));
    return (
        <div>
            <h5>Bookings: </h5>
        </div>
    )
}

export function Login({ login }) {

    const init = { username: "", password: "" };
    const [loginCredentials, setLoginCredentials] = useState(init);

    const performLogin = (evt) => {
        evt.preventDefault();
        login(loginCredentials.username, loginCredentials.password);
    }
    const onChange = (evt) => {
        setLoginCredentials({ ...loginCredentials, [evt.target.id]: evt.target.value })
    }
    return (
        <div>
            <h2>Login here</h2>
            <form onChange={onChange}>
                <input placeholder="Username" id="username" />
                <input placeholder="Password" id="password" />
                <button onClick={performLogin}>Login</button>
            </form>
        </div>
    )
}

export function LoggedIn({username}) {

const  token = apiFacade.getToken();
const  decoded = jwt_decode(token); // jwt_decode is an external library
    return (
        <div>
            <h2>You are now logged in!</h2>
            <p>Welcome {username}, your role is: {decoded.roles}</p>
        </div>
    )
}

export function NoMatch() {
    return (
        <div>
            <h2>Sorry, we couldn't find that page...</h2>
        </div>
    );
}