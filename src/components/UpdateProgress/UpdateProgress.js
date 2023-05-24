import { Box, CircularProgress, Modal, Stack, Typography } from "@mui/material";
import React, { Fragment } from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

function UpdateProgress({ updating, progress, title, variant }) {
    return (
        <Fragment>
            <Modal
                // hideBackdrop
                open={updating}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 200 }}>
                    <Stack
                        direction="row"
                        spacing={3}
                    >
                        <Typography variant='h6'>{title}</Typography>
                        {variant &&
                            <CircularProgressWithLabel value={progress} variant={variant} />
                        }
                        {!variant &&
                            <CircularProgress />
                        }
                    </Stack>
                </Box>
            </Modal>
        </Fragment>
    );
}

export default UpdateProgress;
