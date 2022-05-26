import React from 'react';
import Box from '@mui/material/Box';

import Header from '../components/Header';
import Row_Loader from './Row_Loader';
import Users_Loader from './Users_Loader';
import Student_Details_Loader from './Student_Details_Loader';

const Loader_Preview = () => {
  const boxStyle1 = {
    width: 700,
    height: 230,
    backgroundColor: 'grey.400',
    padding: '10px 20px'
  }

  const boxStyle2 = {
    width: 700,
    height: 230,
    backgroundColor: 'grey.400',
    padding: '10px 20px'
  }

  const boxStyle3 = {
    width: '70%',
    height: 500,
    backgroundColor: 'white',
    padding: '10px 20px'
  }

  return (
    <div style={{padding:'10px 20px', backgroundColor: 'white', marginTop: '40px', padding: '20px 40px'}}>
      {/* Header */}
      <Header />
      <h1>Loader Preview</h1>
      <hr />
      
      {/* Row Loader */}
      <h2>View Students / View Summary / View Logs Page</h2>
        <Box sx={boxStyle1}>
          <Row_Loader/>
        </Box>
      <hr />

      {/* Users Loader */}
      <h2>View Users Page</h2>
        <Box sx={boxStyle2}>
          <Users_Loader/>
        </Box>
      <hr />

      {/* Student Details Loader */}
      <h2>View Student Details Page</h2>
        <Box sx={boxStyle3}>
          <Student_Details_Loader />
        </Box>
      <hr />

    </div>
  )
}

export default Loader_Preview