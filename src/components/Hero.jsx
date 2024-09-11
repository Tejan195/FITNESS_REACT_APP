
import './Hero.css';
const Hero = () => {
  return (
   <section id="HERO" className="min-vh-100 d-flex align-items-center">
    <div className="container">
        <div className="row ">
            <div className="col-12">
                <h1 className="text-uppercase text-white fw-semibold display-1"data-aos="fade-up">Fitech.ai</h1>
                <h5 className="text-uppercase text-white mt-3 mb-4 "data-aos="fade-up">Revolutionizing fitness with AI-driven nutrition and plans</h5>
                <div className="btn">
                        <a href="#"><button className="btn1 " data-aos="fade-up">GET STARTED</button></a>
                        <a href="#"><button className="btn2 " data-aos="fade-up">CONTACT US</button></a>
                    </div>
            </div>
        </div>
    </div>
   </section>
  )
}

export default Hero
