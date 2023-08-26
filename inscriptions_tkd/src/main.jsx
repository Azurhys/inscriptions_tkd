import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css';
import {  BrowserRouter , Routes , Route } from "react-router-dom"
import Inscription from './composants/Inscription';
import Settings from './composants/Settings';
import Membres from './composants/Membres';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<Inscription />} />
          <Route path='settings' element={<Settings />} />
          <Route path='membres' element={<Membres />} />
        </Route>
      </Routes>
  </BrowserRouter>
)
