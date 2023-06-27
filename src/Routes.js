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


export default function AllRoutes() {
  return (
    <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        
        <Route element={<PersistentLogin />}>
            <Route element={<RequireAuth />}>
              <Route path="/" element={<MainLayout />}> 
                <Route path="/" element={<Home />} />
                <Route path="/charts" element={<Charts />} />
              </Route>
            </Route>
          
        </Route>
        <Route path="*" element={<Missing />} />
    </Routes>
  )
}