import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faInstagram, faFacebook, faGithub } from '@fortawesome/free-solid-svg-icons';
const Footer = () => {
  return (
    <footer className="">
      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-sm-6">
                <h1>Fitech.Ai</h1>
              <div className="line"></div>
              <p>Empowering Wellness Through Technology</p>
              <div id="social-icons">
               <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
                <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
                <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
                <a href="#"><FontAwesomeIcon icon={faGithub} /></a>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <h6 className="mb-0 text-white">SERVICES</h6>
              <div className="line"></div>
              <ul>
                <li><a href="#">Personalized plans</a></li>
                <li><a href="#">AI-Powered suggestions</a></li>
                <li><a href="#">Fitness tracking</a></li>
              </ul>
            </div>
            <div className="col-lg-3 col-sm-6">
              <h6 className="mb-0 text-white">ABOUT</h6>
              <div className="line"></div>
              <ul>
                <li><a href="#">Our Vision</a></li>
                <li><a href="#">Our Technology</a></li>
              </ul>
            </div>
            <div className="col-lg-3 col-sm-6">
              <h6 className="mb-0 text-white">CONTACT</h6>
              <div className="line"></div>
              <ul>
                <li><a href="#">BHUBANESWAR, 751003</a></li>
                <li><a href="#">+91-(8791XXXX81)</a></li>
                <li><a href="#">companyFinTech555@gmail.com</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom">
        <div className="container">
          <div className="row">
            <div className="col-auto">
              <p className="mb-0">&copy; 2024 FiTech.ai. All rights reserved.</p>
            </div>
            <div className="col-auto">
              <p className="mb-0">Designed by Tej</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
