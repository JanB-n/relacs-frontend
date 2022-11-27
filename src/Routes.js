import React from 'react'
import { Route, Switch } from 'react-router-dom';
import { MainLayout } from './components/Layouts';
import Charts from './features/Charts/Charts';
import Home from './features/Home/Home'
import Tree from './components/Tree/Tree'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import RequireAuth from './components/RequireAuth/RequireAuth';

export default function Routes() {
  return (
    <Switch>
        <Register/>
        <Login/>
        <Route element={<RequireAuth/>}>
          <MainLayout>
              <Route exact path="/login" component = {Login}/>
              <Route exact path="/register" component = {Register}/>
              <Route exact path="/" component = {Home}/>
              <Route exact path="/charts" component = {Charts}/>
              <Route exact path="/tree" component = {Tree}/>
          </MainLayout>
        </Route>
    </Switch>
  )
}
