import { blue } from '@mui/material/colors'
import React from 'react'

export default function Home() {
  return (
    <>
    <div>
      <h1 style={{alignItems: 'center', display: 'flex', justifyContent: 'center', color: blue}}> Welcome to relACs Web! </h1>
    </div>
    <div style={{alignItems: 'center', display: 'flex', justifyContent: 'center', marginTop: '2%'}}>
        <h3>Getting started:</h3>
    </div>
    <div style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
        <h5>1. Enter the "Compounds" tab and create a new compound.</h5>
    </div>
    <div style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
        <h5>2. Click the compound you created and choose "add measurements".</h5>
    </div>
    <div style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
        <h5>3. Upload correct data file - its name most likely ends with ".dat".</h5>
    </div>
    <div style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
        <h5>4. Choose a measurement group and click it. </h5>
    </div>
    <div style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
        <h5>5. You are on a measurement page. Measurements on the charts can be selected and deleted. </h5>
    </div>
    <div style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
        <h5>6. If you managed to pass through all the steps above then good job! Enjoy storing and editing compound measurements in relAcs Web! </h5>
    </div>
    </>
  )
}
