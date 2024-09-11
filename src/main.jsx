import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import App from './App.jsx'
import 'aos/dist/aos.css'; 
import AOS from 'aos'; 

AOS.init({
  offset: 120,
  delay: 0,
  duration: 900,
  easing: 'ease',
  once: false,
  mirror: false,
  anchorPlacement: 'top-bottom',
});
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
