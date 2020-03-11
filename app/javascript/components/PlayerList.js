import { Box, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Typography } from '@material-ui/core';
import { Link } from '@reach/router';
import React, { useEffect, useState } from 'react';

const PlayerList = (props) => {
    const daysInWords = props.daysInWords;
    const [ players, setPlayers ] = useState([]);
    const [ order, setOrder ] = useState('desc');
    const [ orderBy, setOrderBy ] = useState('Points');

    // ======== Players array ========
    
    const updatePlayers = () => {
        const requestPlayers = async () => {
            const response = await fetch(`api/players`);
            const { data } = await response.json();
            setPlayers(data);
        };
        requestPlayers();
    };

    useEffect(updatePlayers, []);

    // ======== Sorting ========

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const createSortHandler = (property) => (event) => {
        handleRequestSort(event, property);
    };

    function descendingComparator(a, b, orderBy) {
        if (b.attributes[orderBy] < a.attributes[orderBy]) {
            return -1;
        } else if (b.attributes[orderBy] > a.attributes[orderBy]) {
            return 1;
        }
        return 0;
    }

    const getComparator = (order, orderBy) => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy.toLowerCase())
            : (a, b) => -descendingComparator(a, b, orderBy.toLowerCase());
    };

    // ======== Table ========

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
                                <TableCell key={id} sortDirection={orderBy === header ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === header}
                                        direction={orderBy === header ? order : 'asc'}
                                        onClick={createSortHandler(header)}
                                    >
                                        <Typography variant='subtitle1'>
                                            <Box fontWeight='fontWeightBold'>{header}</Box>
                                        </Typography>
                                        {orderBy === header ? (
                                            <span hidden>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </span>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {players.length ? (
                            players
                                .sort(getComparator(order, orderBy))
                                .map((player) => (
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
