import { useState } from 'react'
import { Link, Outlet } from "react-router-dom";
import Menu from './composants/Menu';

function App() {
  return ( <div className="page">
    <Menu />
    <div className="container">
      <Outlet />
    </div>
  </div> );
}

export default App
