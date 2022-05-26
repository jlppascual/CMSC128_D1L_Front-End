import * as React from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

export default function Row_Loader() {
  let skeleton_records = []

  for (let i=0; i<4; i++) {

    skeleton_records.push(
      <Card sx={{
        bgcolor: 'grey.100',
        width: '100%',
        height: '44px',
        marginTop: '12px',
      }}>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant='body'>
                <Skeleton
                  animation='wave'
                  sx={{ bgcolor: 'grey.500', width: '80%', height: '40px', marginLeft: '20px' }}
                />
              </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant='body'>
              <Skeleton
                animation='wave'
                sx={{ bgcolor: 'grey.500', width: '60%', height: '40px', marginLeft: '60px' }}
              />
            </Typography>
          </Grid>
          
          <Grid item xs={4}>
            <Typography variant='body'>
              <Skeleton
                animation='wave'
                sx={{ bgcolor: 'grey.500', width: '50%', height: '40px', marginLeft: '50px' }}
              />
            </Typography>
          </Grid>
        </Grid>

      </Card>
    )
  }

  return (
    <div>{skeleton_records}</div>
  );
}
