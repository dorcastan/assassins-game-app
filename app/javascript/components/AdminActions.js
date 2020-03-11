import { Box, Button, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Snackbar, Typography } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { Link } from '@reach/router';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';

// Smaller components

const PaperStyle = (props) => (
    <Paper>
        <Box m={2} p={1}>
            {props.children}
        </Box>
    </Paper>
);

const PlayerNameField = (props) => (
    <Field as={Select} type='text' id={props.id} name={props.id} label='Name' required style={{ width: 300 }}>
        {props.players.map((player) => (
            <MenuItem key={player.id} value={player.id}>
                {player.name}
            </MenuItem>
        ))}
    </Field>
);

// Main Action Forms

const KillForm = (props) => (
    <div>
        <Typography variant='h6'>Submit kill</Typography>
        <Typography variant='body1'>i.e. Increase killer points and make victim dead</Typography>

        <Formik
            initialValues={{ killer: '', victim: '' }}
            onSubmit={(values) => props.handleSubmit(`/kill?killer=${values.killer}&victim=${values.victim}`)}
        >
            <Form>
                <Box my={1}>
                    <InputLabel id='killer'>Killer</InputLabel>
                    <PlayerNameField players={props.players} id='killer' />
                </Box>
                <Box my={1}>
                    <InputLabel id='victim'>Victim</InputLabel>
                    <PlayerNameField players={props.players} id='victim' />
                </Box>
                <Button type='submit' variant='contained' color='primary'>
                    Submit
                </Button>
            </Form>
        </Formik>
    </div>
);

const NextDayForm = (props) => (
    <div>
        <Typography variant='h6'>Mark end of day</Typography>
        <Typography variant='body1'>i.e. Update player levels based on today's kills</Typography>

        <br />
        <Typography variant='subtitle1' color='primary'>
            Current day: {props.day}
        </Typography>
        <Button onClick={() => props.handleSubmit(`/next_day`)} variant='contained' color='primary'>
            End Day
        </Button>
    </div>
);

const LevelUpForm = (props) => (
    <div>
        <Typography variant='h6'>Increase player level</Typography>
        <Typography variant='body1' color='primary'>
            >> Use "END DAY" instead of this
        </Typography>

        <Formik
            initialValues={{ id: props.players[0] ? props.players[0].id : '' }}
            onSubmit={(values) => props.handleSubmit(`/level_up?id=${values.id}`)}
        >
            <Form>
                <Box my={1}>
                    <PlayerNameField players={props.players} id='id' />
                </Box>
                <Button type='submit' variant='contained' color='primary' disabled>
                    Level up
                </Button>
            </Form>
        </Formik>
    </div>
);

const RevivePlayerForm = (props) => (
    <div>
        <Typography variant='h6'>Revive player</Typography>

        <Formik
            initialValues={{ id: props.players[0] ? props.players[0].id : '' }}
            onSubmit={(values) => props.handleSubmit(`/revive?id=${values.id}`)}
        >
            <Form>
                <Box my={1}>
                    <PlayerNameField players={props.players} id='id' />
                </Box>
                <Button type='submit' variant='contained' color='primary'>
                    Revive
                </Button>
            </Form>
        </Formik>
    </div>
);

// Undo Action Forms

const UndoKillForm = (props) => (
    <div>
        <Typography variant='h6'>Undo kill</Typography>
        <Typography variant='body1'>i.e. Decrease killer points and make victim alive</Typography>

        <Formik
            initialValues={{ killer: '', victim: '' }}
            onSubmit={(values) => props.handleSubmit(`/undo_kill?killer=${values.killer}&victim=${values.victim}`)}
        >
            <Form>
                <Box my={1}>
                    <InputLabel id='killer'>Killer</InputLabel>
                    <PlayerNameField players={props.players} id='killer' />
                </Box>
                <Box my={1}>
                    <InputLabel id='victim'>Victim</InputLabel>
                    <PlayerNameField players={props.players} id='victim' />
                </Box>
                <Button type='submit' variant='contained' color='secondary'>
                    Undo
                </Button>
            </Form>
        </Formik>
    </div>
);

const UndoNextDayForm = (props) => (
    <div>
        <Typography variant='h6'>Undo end of day</Typography>
        <Typography variant='body1'>i.e. Go back to yesterday's player levels</Typography>

        <br />
        <Typography variant='subtitle1' color='secondary'>
            Current day: {props.day}
        </Typography>
        <Button onClick={() => props.handleSubmit(`/undo_next_day`)} variant='contained' color='secondary'>
            Go Back
        </Button>
    </div>
);

const LevelDownForm = (props) => (
    <div>
        <Typography variant='h6'>Undo increase in player level</Typography>
        <Typography variant='body1'>i.e. Level down</Typography>
        <Typography variant='body1' color='secondary'>
            >> You shouldn't need to use this
        </Typography>

        <Formik
            initialValues={{ id: props.players[0] ? props.players[0].id : '' }}
            onSubmit={(values) => props.handleSubmit(`/undo_level_up?id=${values.id}`)}
        >
            <Form>
                <Box my={1}>
                    <PlayerNameField players={props.players} id='id' />
                </Box>
                <Button type='submit' variant='contained' color='secondary' disabled>
                    Undo level up
                </Button>
            </Form>
        </Formik>
    </div>
);

const UndoReviveForm = (props) => (
    <div>
        <Typography variant='h6'>Undo revive</Typography>
        <Typography variant='body1'>i.e. Make player dead</Typography>

        <Formik
            initialValues={{ id: props.players[0] ? props.players[0].id : '' }}
            onSubmit={(values) => props.handleSubmit(`/undo_revive?id=${values.id}`)}
        >
            <Form>
                <Box my={1}>
                    <PlayerNameField players={props.players} id='id' />
                </Box>
                <Button type='submit' variant='contained' color='secondary'>
                    Undo revive
                </Button>
            </Form>
        </Formik>
    </div>
);

// Main component

const AdminActions = () => {
    const [ players, setPlayers ] = useState([]);
    const [ day, setDay ] = useState(0);
    const [ open, setOpen ] = useState(false);
    const [ message, setMessage ] = useState('Hello!');

    // Updates the array of players
    const updatePlayers = () => {
        const requestPlayers = async () => {
            const response = await fetch(`api/players`);
            const { data } = await response.json();
            setPlayers(
                data
                    .map((player) => ({ id: player.id, name: player.attributes.name }))
                    .sort((a, b) => a.name.localeCompare(b.name))
            );
        };
        requestPlayers();
    };
    useEffect(updatePlayers, []);

    // Updates the current day
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

    // Handles snackbar notifications
    const openSnackbar = (msg) => {
        setMessage(msg);
        setOpen(true);
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setMessage('');
    };

    // Template handleSubmit function for admin action forms
    const handleSubmit = (url) => {
        const sendRequest = async () => {
            const response = await fetch(url);
            const data = await response.json();
            switch (data.status) {
                case 0:
                    openSnackbar('Successfully updated!');
                    updateDay(); // HACKY
                    break;
                case 1:
                    openSnackbar('ERROR: Failed to carry out action. Please contact developer.');
                    break;
                case 2:
                    console.log(data);
                    openSnackbar(
                        'Player in invalid state. \n' +
                            '(e.g. cannot kill an already-dead victim, or revive a living player)'
                    );
                    break;
                case 3:
                    openSnackbar('Victim has been killed by the same killer before');
                    break;
                case 4:
                    openSnackbar('Killer has not killed this victim before');
                    break;
                case 5:
                    openSnackbar('Day should be between 1 and 10');
                    break;
                case 6:
                    openSnackbar('Cannot kill self!');
                    break;
                case 10:
                    openSnackbar('ERROR: Developer made a logic error somewhere. Please let her know.');
                    break;
                default:
                    openSnackbar('ERROR: Please screenshot console (right click -> Inspect) and contact developer.');
                    console.log(data);
                    break;
            }
        };
        sendRequest();
    };

    // TODO: REACTIVATE CHECK
    // return props.loggedInStatus ? (
    return (
        <div>
            <Box p={2}>
                <Typography variant='h2'>Admin Page</Typography>
                <Grid container justify='flex-end'>
                    <Grid item>
                        <Button component={Link} to='/' variant='contained'>
                            Home
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            {/* {players.map((p) => (
                <Typography variant='body1' key={p.id}>
                    {p.name}
                </Typography>
            ))} */}
            <Box m={2}>
                <Typography variant='h4'>Main actions</Typography>

                <Grid container justify='flex-start' spacing='3'>
                    <Grid item>
                        <PaperStyle>
                            <KillForm players={players} handleSubmit={handleSubmit} />
                        </PaperStyle>
                    </Grid>
                    <Grid item>
                        <PaperStyle>
                            <NextDayForm day={daysInWords[day - 1]} handleSubmit={handleSubmit} />
                        </PaperStyle>
                    </Grid>
                </Grid>
                <Grid container justify='flex-start' spacing='3'>
                    <Grid item>
                        <PaperStyle>
                            <LevelUpForm players={players} handleSubmit={handleSubmit} />
                        </PaperStyle>
                    </Grid>
                    <Grid item>
                        <PaperStyle>
                            <RevivePlayerForm players={players} handleSubmit={handleSubmit} />
                        </PaperStyle>
                    </Grid>
                </Grid>

                <Box m={5} />

                <Typography variant='h4'>Undo actions</Typography>
                <Typography variant='subtitle1' color='secondary'>
                    >> Use with caution!
                </Typography>
                <Typography variant='subtitle1' color='secondary'>
                    >> Make sure only ONE person uses this at a time
                </Typography>
                <Typography variant='subtitle1' color='secondary'>
                    >> Make sure actions are undone in order
                </Typography>

                <Grid container justify='flex-start' spacing='3'>
                    <Grid item>
                        <PaperStyle>
                            <UndoKillForm players={players} handleSubmit={handleSubmit} />
                        </PaperStyle>
                    </Grid>
                    <Grid item>
                        <PaperStyle>
                            <UndoNextDayForm day={daysInWords[day - 1]} handleSubmit={handleSubmit} />
                        </PaperStyle>
                    </Grid>
                </Grid>
                <Grid container justify='flex-start' spacing='3'>
                    <Grid item>
                        <PaperStyle>
                            <LevelDownForm players={players} handleSubmit={handleSubmit} />
                        </PaperStyle>
                    </Grid>
                    <Grid item>
                        <PaperStyle>
                            <UndoReviveForm players={players} handleSubmit={handleSubmit} />
                        </PaperStyle>
                    </Grid>
                </Grid>
            </Box>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={message}
                action={
                    <IconButton size='small' aria-label='close' color='inherit' onClick={handleClose}>
                        <CloseIcon fontSize='small' />
                    </IconButton>
                }
            />
        </div>
        // ) : (
        //     <NotFound />
    );
};

export default AdminActions;
