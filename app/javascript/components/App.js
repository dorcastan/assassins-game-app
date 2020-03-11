import { Router } from '@reach/router';
import React, { useState } from 'react';
import AdminActions from './AdminActions';
import Login from './Login';
import NotFound from './NotFound';
import PlayerList from './PlayerList';

function App() {
    const [ loggedInStatus, setLoggedInStatus ] = useState(false);
    const [ user, setUser ] = useState({});

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

    return (
        <Router>
            <PlayerList path='/' />
            <Login path='/login' handleLogin={handleLogin} />
            <AdminActions path='/admin_actions' loggedInStatus={loggedInStatus} />
            <NotFound default />
        </Router>
    );
}

export default App;
