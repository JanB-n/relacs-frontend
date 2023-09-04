import React from 'react';
import ReactDOM from 'react-dom/client';
import Routes from './Routes';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { AuthProvider } from './context/AuthProvider'
import MainLayout from './components/MainLayout';
import Header from './components/Header';
import PersistentLogin from './components/PersistentLogin';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <PersistentLogin> 
            <MainLayout>
                <Routes/>
            </MainLayout>
          </PersistentLogin>
        </AuthProvider>
      </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
