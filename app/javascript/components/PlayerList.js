import { Box, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { Link } from '@reach/router';
import React, { useEffect, useState } from 'react';

const PlayerList = (props) => {
    const daysInWords = props.daysInWords;
    const [ players, setPlayers ] = useState([]);

    // Updates the array of players
    const updatePlayers = () => {
        const requestPlayers = async () => {
            const response = await fetch(`api/players`);
            const { data } = await response.json();
            setPlayers(data.sort((player1, player2) => player2.attributes.points - player1.attributes.points));
        };
        requestPlayers();
    };

    useEffect(updatePlayers, []);

    const tableHeaders = [ 'Name', 'Level', 'Status', 'Points' ];

    return (
        <Box m={2}>
            <Typography variant='h2'>Phoenix Assassins</Typography>
            <Grid container justify='flex-end' spacing={1}>
                <Grid item>
                    <Button component={Link} to='/today' variant='contained' color='secondary'>
                        Today's Kills
                    </Button>
                </Grid>
                <Grid item>
                    <Button component={Link} to='/login' variant='contained'>
                        Login
                    </Button>
                </Grid>
            </Grid>

            <Typography component='div' variant='body1'>
                <Box>Date: {daysInWords[props.day - 1]}</Box>
            </Typography>

            <Box m={1}>
                <Table>
                    <TableHead>
                        <TableRow color='primary'>
                            {tableHeaders.map((header, id) => (
                                <TableCell key={id}>
                                    <Typography variant='subtitle1'>
                                        <Box fontWeight='fontWeightBold'>{header}</Box>
                                    </Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {players.length ? (
                            players.map((player) => (
                                <TableRow key={player.id}>
                                    <TableCell>{player.attributes.name}</TableCell>
                                    <TableCell>{player.attributes.level}</TableCell>
                                    <TableCell>{player.attributes.status ? 'Alive' : 'Dead'}</TableCell>
                                    <TableCell>{player.attributes.points}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan='4'>No Players found!</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Box>
            <Box my={1}>
                <Button onClick={updatePlayers} variant='contained' color='primary'>
                    Refresh
                </Button>
            </Box>
        </Box>
    );
};

export default PlayerList;
