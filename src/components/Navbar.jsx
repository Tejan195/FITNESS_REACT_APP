import { useEffect } from "react"
import './Navbar.css'
const Navbar = () => {
 useEffect (()=>{
  const darkModeToggle = document.getElementById('darkModeToggle');
  const navbar = document.querySelector('.navbar');
  const isDarkMode = localStorage.getItem('darkMode')==='true';
  if(isDarkMode){
    document.documentElement.setAttribute('data-bs-theme','dark');
    navbar.classList.add('bg-dark');
    darkModeToggle.checked = true;
  }
const handleDarkModeClick=()=>{
  if(darkModeToggle.checked){
    document.documentElement.setAttribute('data-bs-theme','dark');
    navbar.classList.add('bg-dark');
    localStorage.setItem('darkMode','true');
  }else{
    document.documentElement.setAttribute('data-bs-theme', 'light');
        navbar.classList.remove('bg-dark');
        localStorage.setItem('darkMode', 'false');
  }
};
darkModeToggle.addEventListener('click',handleDarkModeClick);
return ()=>{
  darkModeToggle.removeEventListener('click',handleDarkModeClick);
};
 },[]);
  return (
      <nav className="navbar navbar-expand-md  sticky-top">
        <div className="container-fluid">
            <a className="navbar-brand" href="#">FiTECH.Ai</a>
              <button className="navbar-toggler" type="button"  data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" style={{outline: 'none', boxShadow: 'none'}}>
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                   <li className="nav-item">
                    <a className="nav-link active ms auto" aria-current="page" href="#HERO">Home</a>
                   </li>
                    <li className="nav-item me-2">
                        <a className="nav-link" href="#services">Membership</a>
                    </li>
                    <li className="nav-item me-2">
                        <a className="nav-link " href="#ABOUT">About-Us</a>
                    </li>
                    <li className="nav-item me-3" id="signinLink">
                            <a className="nav-link" href="?logout=true"><button id="logoutButton">Logout</button></a>
                                <a className="nav-link" href="#"><button id="signInButton">Sign-In</button></a>
                    </li>
                </ul>
                <div className="toggle-switch">
  <label className="switch-label">
    <input type="checkbox" className="checkbox" id="darkModeToggle"/>
    <span className="slider"></span>
  </label>
</div>  
            </div>
        </div>
    </nav>
   
  )
}

export default Navbar
