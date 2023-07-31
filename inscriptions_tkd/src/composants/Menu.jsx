import { NavLink , useNavigate } from "react-router-dom"

function Menu() {
    return ( 
        <div className="bg-dark mb-3">
            <nav className="navbar navbar-expand navbar-dark container">
                <span className="navbar-brand fs-3">
                    Inscriptions TKD
                </span>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <NavLink to="/" className={({isActive}) => {
                            return isActive ? "nav-link active text-light" : "nav-link"
                        }}>Inscriptions</NavLink>
                    </li>
                </ul>
                <ul className="navbar-nav ms-auto">    
                    <li className="nav-item ">
                        <NavLink to="/panier" className={({isActive}) => {
                            return isActive ? "nav-link active text-light" : "nav-link"
                        }}>Panier</NavLink>
                    </li>
                </ul>
            </nav>
        </div>
     );
}

export default Menu;