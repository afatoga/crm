import * as React from 'react';

import {
    Typography,
    Box,
    Button
} from "@mui/material";

import {ModalContext} from '../../../contexts/ModalContext';

export const PartyRelationships = () => {

    let { handleModal } = React.useContext(ModalContext);  

    const toggleNewRelationshipModal = () => {
        handleModal('NewRelationship');
    }

    return (
        <Box sx={{
            width: {
              xs: "100%", // theme.breakpoints.up('xs')
              md: "40%", // theme.breakpoints.up('sm')
              // md: 300, // theme.breakpoints.up('md')
              lg: 360, // theme.breakpoints.up('lg')
              //xl: 500, // theme.breakpoints.up('xl')
            },
            padding: {
                xs: '1rem 0',
                md: '1rem 2rem'
            }
          }}>

            <Typography variant="h6">
                Relationships
            </Typography>

            <Button variant={"contained"} sx={{my: 3 ,width: '120px'}} onClick={toggleNewRelationshipModal}>
                Add new
            </Button>

        </Box>
    )
}