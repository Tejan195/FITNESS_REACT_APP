import { useRef } from 'react';
import './Services.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faChevronRight as faArrow } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Services = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === 'left') {
      current.scrollLeft -= 320;
    } else {
      current.scrollLeft += 320;
    }
  };

  return (
    <section className="services-section section-padding border-top" id="services">
      <div className="container my-5">
        <div className="row mb-4 text-center">
          <div className="col">
            <h5 data-aos="fade-up"data-aos-delay="500">TAILORED FITNESS SOLUTIONS</h5>
            <h2 data-aos="fade-up"data-aos-delay="600">Your path to optimal health</h2>
          </div>
        </div>
        <div className="scroll-wrapper position-relative"data-aos="fade-up"data-aos-delay="500">
          <button className="scroll-button left" onClick={() => scroll('left')}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div className="scroll-container d-flex overflow-auto" ref={scrollRef}>
            <div className="wrapper-card d-flex flex-column align-items-center mx-2">
              <img
                alt="Happy Meal - Dolphin Jumps"
                loading="lazy"
                src="https://cdn.b12.io/client_media/swIjeAt5/4d747c28-5bb6-11ef-912a-0242ac110002-jpg-regular_image.jpeg"
                className="card-img-top"
              />
              <div className="text-area text-center">
                <h5>Personalized nutrition plans <FontAwesomeIcon icon={faArrow} /></h5>
                <p>Receive nutrition recommendations tailored just for you.</p>
              </div>
            </div>
            <div className="wrapper-card d-flex flex-column align-items-center mx-2">
              <img
                alt="A morning yoga session peering into the jungle in Ubud, Bali."
                loading="lazy"
                src="https://cdn.b12.io/client_media/swIjeAt5/4e3c7cf0-5bb6-11ef-912a-0242ac110002-jpg-regular_image.jpeg"
                className="card-img-top"
              />
              <div className="text-area text-center">
                <h5><Link to="/running-track">Fitness data tracking <FontAwesomeIcon icon={faArrow} /></Link></h5>
                <p>Monitor your fitness progress effortlessly.</p>
              </div>
            </div>
            <div className="wrapper-card d-flex flex-column align-items-center mx-2">
              <img
                alt="Woman working out with battle ropes and getting fit!"
                loading="lazy"
                src="https://cdn.b12.io/client_media/swIjeAt5/4d5099b6-5bb6-11ef-912a-0242ac110002-jpg-regular_image.jpeg"
                className="card-img-top"
              />
              <div className="text-area text-center">
                <h5>AI-Driven workout suggestions <FontAwesomeIcon icon={faArrow} /></h5>
                <p>Receive workout plans tailored to your goals.</p>
              </div>
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scroll('right')}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
