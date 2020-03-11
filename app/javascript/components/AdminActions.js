import { Box, Button, Grid, InputLabel, MenuItem, Paper, Select, Typography } from '@material-ui/core';
import { Link } from '@reach/router';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';

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

const LevelUpForm = (props) => (
    <div>
        <Typography variant='h6'>Increase player level</Typography>
        <Formik
            initialValues={{ id: props.players[0] ? props.players[0].id : '' }}
            onSubmit={(values) => props.handleSubmit(`/level_up?id=${values.id}`)}
        >
            <Form>
                <Box my={1}>
                    <PlayerNameField players={props.players} id='id' />
                </Box>
                <Button type='submit' variant='contained' color='primary'>
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

const LevelDownForm = (props) => (
    <div>
        <Typography variant='h6'>Undo level up</Typography>
        <Typography variant='body1'>i.e. level down</Typography>

        <Formik
            initialValues={{ id: props.players[0] ? props.players[0].id : '' }}
            onSubmit={(values) => props.handleSubmit(`/undo_level_up?id=${values.id}`)}
        >
            <Form>
                <Box my={1}>
                    <PlayerNameField players={props.players} id='id' />
                </Box>
                <Button type='submit' variant='contained' color='secondary'>
                    Undo level up
                </Button>
            </Form>
        </Formik>
    </div>
);

const UndoReviveForm = (props) => (
    <div>
        <Typography variant='h6'>Undo revive</Typography>
        <Typography variant='body1'>i.e. make player dead</Typography>

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

const AdminActions = (props) => {
    const [ players, setPlayers ] = useState([]);

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

    // Template handleSubmit function for admin action forms
    const handleSubmit = (url) => {
        const sendRequest = async () => {
            const response = await fetch(url);
            const data = await response.json();
            if (data.status == 0) {
                console.log(data.player);
            } else {
                console.log(data);
            }
        };
        sendRequest();
    };

    // temporarily disable props.loggedInStatus check
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

                <Grid container justify='space-evenly'>
                    <Grid item>
                        <PaperStyle>
                            <KillForm players={players} handleSubmit={handleSubmit} />
                        </PaperStyle>
                    </Grid>
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
                <Typography variant='h6' color='secondary'>
                    >> Use with caution!
                </Typography>
                <Typography variant='h6' color='secondary'>
                    >> Make sure only ONE person uses this at a time
                </Typography>
                <Typography variant='h6' color='secondary'>
                    >> Make sure actions are undone in order
                </Typography>

                <Grid container justify='space-evenly'>
                    <Grid item>
                        <PaperStyle>
                            <UndoKillForm players={players} handleSubmit={handleSubmit} />
                        </PaperStyle>
                    </Grid>
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
        </div>
        // ) : (
        //     <NotFound />
    );
};

export default AdminActions;
