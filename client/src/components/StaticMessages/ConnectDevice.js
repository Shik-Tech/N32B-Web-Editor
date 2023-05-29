import React from 'react';
import { Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { map } from 'lodash';

function ConnectDevice() {
    const supportedBrowsers = [
        "Edge v79+",
        "Chrome 43+",
        "Opera 30+",
        "Firefox 108+",
    ];

    return (
        <Grid
            container
            spacing={2}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: 'calc(100vh - 48px)', textAlign: 'center' }}
        >
            <Grid item>
                <WarningAmberRoundedIcon color="warning" fontSize="large" />
            </Grid>
            <Grid item>
                <Typography>Please connect the N32B to your computer with a data usb cable</Typography>
                <Typography variant='body2'>
                    Make sure you connect only one N32B device while using the editor
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant='body2'>Please use one of the following browsers:</Typography>
                <List dense>
                    {map(supportedBrowsers, browser => (
                        <ListItem key={browser}>
                            <ListItemText primary={browser} />
                        </ListItem>)
                    )}
                </List>

            </Grid>
        </Grid>
    )
}

export default ConnectDevice;
