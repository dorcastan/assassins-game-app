import { Box, Button, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';
import { Link } from '@reach/router';
import React, { useEffect, useState } from 'react';

const TodayList = (props) => {
    const daysInWords = props.daysInWords;

    const [ kills, setKills ] = useState([]);
    const [ day, setDay ] = useState(props.day);

    // Updates the array of players
    const updateKills = () => {
        const requestKills = async () => {
            const response = await fetch(`api/kills?filter[day]=${day}`);
            const { data } = await response.json();
            setKills(
                data.map((kill) => ({
                    id: kill.id,
                    killer: kill.attributes.killer,
                    victim: kill.attributes.victim,
                    day: kill.attributes.day
                }))
            );
        };
        requestKills();
    };
    useEffect(updateKills, [ day ]);

    const changeDay = (direction) => {
        if (direction === 'up' && day <= 10) {
            setDay(day + 1);
        } else if (direction === 'down' && day > 1) {
            setDay(day - 1);
        }
    };

    const tableHeaders = [ 'Kill Log' ];

    return (
        <Box m={2}>
            <Typography variant='h2'>Phoenix Assassins</Typography>
            <Grid container justify='flex-end'>
                <Grid item>
                    <Button component={Link} to='/' variant='contained' color='secondary'>
                        Home
                    </Button>
                </Grid>
            </Grid>

            <br />

            <Grid container justify='space-between'>
                <Grid item>
                    <IconButton
                        onClick={() => changeDay('down')}
                        disabled={day <= 1}
                        color='primary'
                    >
                        <ArrowLeft />
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton
                        onClick={() => changeDay('up')}
                        disabled={day >= props.day}
                        color='primary'
                    >
                        <ArrowRight />
                    </IconButton>
                </Grid>
            </Grid>

            <Typography component='div' variant='body1'>
                <Box>Date: {daysInWords[day - 1]}</Box>
                <Box variant='body1'>Number of kills: {kills ? kills.length : 0}</Box>
            </Typography>

            <div>
                <Table>
                    <TableHead>
                        <TableRow>
                            {tableHeaders.map((header, id) => (
                                <TableCell key={id}>
                                    <Typography variant='subtitle1' color='primary'>
                                        <Box fontWeight='fontWeightBold'>{header}</Box>
                                    </Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {kills && kills.length ? (
                            kills.map((kill) => (
                                <TableRow key={kill.id}>
                                    <TableCell>
                                        {kill.killer[1]} killed {kill.victim[1]}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan='1'>No kills yet!</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <Box my={1}>
                <Button onClick={updateKills} variant='contained' color='primary'>
                    Refresh
                </Button>
            </Box>
        </Box>
    );
};

export default TodayList;
