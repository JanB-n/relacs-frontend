import React from 'react'
import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './features/Home/Home'
import Charts from './features/Charts/Charts'
import Login from './components/Login'
import Register from './components/Register'
import Missing from './features/Redirections/Missing';
import Unauthorized from './features/Redirections/Unauthorized';
import RequireAuth from './components/RequireAuth';
import PersistentLogin from './components/PersistentLogin';
import Compounds from './components/Compounds';
import Compound from './components/Compound';
import Measurement from './components/Measurement.js';
import SharedCompounds from './components/SharedCompounds';


export default function AllRoutes() {
  return (
    <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        
          {/* <Route element={<PersistentLogin />}> */}
            <Route element={<RequireAuth />}>
              {/* <Route element={<MainLayout />}>  */}
                <Route path="/" element={<Home />} />
                <Route path="/charts" element={<Charts />} />
                <Route path="/compounds" element={<Compounds />} />
                <Route path="/sharedcompounds" element={<SharedCompounds />} />
                <Route path=":id/Measurements" element={<Charts  />} />
                <Route path="/compounds/:id" element={<Compound />} />
                <Route path="/compounds/:c_id/:m_id" element={<Measurement />} />
                
              {/* </Route> */}
            </Route>
          
        {/* </Route> */}
        
       

        <Route path="*" element={<Missing />} />
    </Routes>
 
  )
}