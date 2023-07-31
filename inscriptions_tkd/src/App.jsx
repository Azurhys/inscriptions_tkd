import { useState } from 'react'
import { Link, Outlet } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return ( <div className="page">
    <div className="container">
      <Outlet />
    </div>
  </div> );
}

export default App
