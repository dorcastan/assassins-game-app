import { Box, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { Link } from '@reach/router';
import React, { useEffect, useState } from 'react';

const TodayList = (props) => {
    const daysInWords = props.daysInWords;

    const [ kills, setKills ] = useState([]);

    // Updates the array of players
    const updateKills = () => {
        const requestKills = async () => {
            const response = await fetch(`api/kills?filter[day]=${props.day}`);
            const { data } = await response.json();
            setKills(data);
        };
        requestKills();
    };
    useEffect(updateKills, [ props.day ]);

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

            <Typography component='div' variant='body1'>
                <Box>Date: {daysInWords[props.day - 1]}</Box>
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
                        {kills.length ? (
                            kills.map((kill) => (
                                <TableRow key={kill.id}>
                                    <TableCell>
                                        {kill.attributes.killer[1]} killed {kill.attributes.victim[1]}
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
