import { Router } from '@reach/router';
import React, { useEffect, useState } from 'react';
import AdminActions from './AdminActions';
import Login from './Login';
import NotFound from './NotFound';
import PlayerList from './PlayerList';
import TodayList from './TodayList';

function App() {
    const [ loggedInStatus, setLoggedInStatus ] = useState(false);
    const [ user, setUser ] = useState({});
    const [ day, setDay ] = useState(0);

    // Login
    const checkLoggedInStatus = () => {
        const getStatus = async () => {
            const response = await fetch('/logged_in');
            const data = await response.json();
            if (data.logged_in) {
                handleLogin(data);
            } else {
                handleLogout();
            }
        };
        getStatus();
    };

    const handleLogin = (data) => {
        setLoggedInStatus(true);
        setUser(data.user);
    };

    // Current day
    const updateDay = () => {
        const requestCurrentDay = async () => {
            const response = await fetch(`current_day`);
            const { data } = await response.json();
            setDay(data.day);
        };
        requestCurrentDay();
    };

    useEffect(updateDay, []);

    const daysInWords = [
        '11 March (Wednesday)',
        '12 March (Thursday)',
        '13 March (Friday)',
        '14 March (Saturday)',
        '15 March (Sunday)',
        '16 March (Monday)',
        '17 March (Tuesday)',
        '18 March (Wednesday)',
        '19 March (Thursday)',
        '20 March (Friday)',
        '21 March (Saturday)'
    ];

    return (
        <Router>
            <PlayerList path='/' daysInWords={daysInWords} day={day} />
            <TodayList path='/today' daysInWords={daysInWords} day={day} />
            <Login path='/login' handleLogin={handleLogin} />
            <AdminActions
                path='/admin_actions'
                loggedInStatus={loggedInStatus}
                daysInWords={daysInWords}
                day={day}
                updateDay={updateDay}
            />
            <NotFound default />
        </Router>
    );
}

export default App;
