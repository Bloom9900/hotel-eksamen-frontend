import {BASE_URL} from './Settings';

function getBookings(username) {
    const options = makeOptions("GET", true);
    return fetch(BASE_URL + "bookings/" + username)
    .then(handleHttpErrors)
}

function getHotels() {
    const options = makeOptions("GET", false);
    return fetch(BASE_URL + "hotel/all", options)
    .then(handleHttpErrors)
}

function getHotel(id) {
    const options = makeOptions("GET", true);
    return fetch(BASE_URL + "hotel/"+id, options)
    .then(handleHttpErrors)
}

function makeBooking(booking) {
    const options = makeOptions("POST", true, {booking})
    return fetch(BASE_URL + "hotel/book", options)
    .then(handleHttpErrors)
}

const setToken = (token) => {
    localStorage.setItem('jwtToken', token)
}
const getToken = () => {
    return localStorage.getItem('jwtToken')
}
const loggedIn = () => {
    const loggedIn = getToken() != null;
    return loggedIn;
}
const logout = () => {
    localStorage.removeItem("jwtToken");
}

const login = (user, password) => {
    const options = makeOptions("POST", true, { username: user, password: password });
    return fetch(BASE_URL + "login", options)
        .then(handleHttpErrors)
        .then(res => { setToken(res.token) })
}

const apiFacade = {
    getBookings,
    makeBooking,
    getHotels,
    getHotel,
    setToken,
    getToken,
    loggedIn,
    logout,
    login
}

function makeOptions(method, addToken, body) {
    var opts = {
        method: method,
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        }
    }
    if (addToken && loggedIn()) {
        opts.headers["x-access-token"] = getToken();
    }
    if (body) {
        opts.body = JSON.stringify(body);
    }
    return opts;
}

function handleHttpErrors(res) {
    if (!res.ok) {
        return Promise.reject({ status: res.status, fullError: res.json() })
    }
    return res.json();
}

export default apiFacade;