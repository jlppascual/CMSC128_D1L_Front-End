import React from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

const Detail_Loader = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <Typography variant='body1'>
          <Skeleton
            animation='wave'
            sx={{ bgcolor: 'grey.600', width: '100%', height: '40px', marginLeft: '20px' }}
          />
        </Typography>
      </Grid>

      <Grid item xs={2}>
        <Typography variant='body1'>
          <Skeleton
            animation='wave'
            sx={{ bgcolor: 'grey.200', width: '100%', height: '40px', marginLeft: '20px' }}
          />
        </Typography>
      </Grid>

    </Grid>
  )
}

const Record_Loader = () => {

}

const Student_Details_Loader = () => {
  const skeleton_name = () => {
    return (
      <Typography variant='h2'>
        <Skeleton
          animation='wave'
          sx={{ bgcolor: 'grey.500', width: '50%', height: '60px', marginLeft: '20px' }}
        />
      </Typography>
    )
  }

  const skeleton_details = () => {
    let details = [];

    for (let i=0; i<3; i++) {
      details.push(<Detail_Loader />)
    }

    return details;
  }

  return (
    <div>
      { skeleton_name() }
      <hr />

      {/* <Grid container spacing={2} sx={{width:'100%'}}>
        <Grid item xs={2}>
          {skeleton_details()}
        </Grid>
        <Grid item xs={2}>
          {skeleton_details()}
        </Grid>
      </Grid> */}


      <Box sx={{bgcolor: 'grey.400', height: '100%', width: '100%', marginTop: '40px'}}>
        { skeleton_details() }
      </Box>
    </div>
  )
}

export default Student_Details_Loader