import './Section.css'

const HeroSection = () => {
  return (
    <section className="section" id="ABOUT">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-12 text-section"data-aos="fade-up">
            <h5 className="text-uppercase">Empower Your Fitness</h5>
            <h2 className="font-weight-bold">Revolutionizing health with AI</h2>
            <p className="lead">
              Fitech.ai stands at the forefront of fitness innovation in Bhubaneswar. 
              Our advanced platform harnesses the power of artificial intelligence 
              to deliver personalized nutrition recommendations tailored to your unique needs. 
              With seamless API integrations, we effortlessly track and optimize your fitness data, 
              ensuring you achieve your goals efficiently. Join us on this journey towards 
              a healthier, more vibrant you!
            </p>
            <a href="#contact" className="btn mt-3">Get in touch</a>
          </div>
          <div className="col-lg-6 col-md-12 image-section"data-aos="fade-up">
            <img
              src="https://cdn.b12.io/client_media/swIjeAt5/4ad16968-5bb6-11ef-af0d-0242ac110002-jpg-hero_image.jpeg"
              alt="A morning hike at Runyon Canyon in LA. Athletes come to work the hills and enjoy the views…best place to be when the sun rises"
              className="img-fluid"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

