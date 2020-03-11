import { Box, Typography } from '@material-ui/core';
import React from 'react';

const NotFound = () => (
    <div>
        <Typography variant='h3'>Page Not Found</Typography>
        <Box my={2}>
            <Typography variant='body1'>There's nothing here. Perhaps the URL was spelt wrongly?</Typography>
        </Box>
    </div>
);

export default NotFound;
