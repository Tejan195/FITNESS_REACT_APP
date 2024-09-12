import { useState, useMemo, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import "./RunningTrack.css";

const RunningTrack = () => {
  const [location, setLocation] = useState(null);
  const googleMapAPI = useMemo(() => import.meta.env.VITE_API_KEY, []);
  const [isPlay, setPlay] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      if (navigator.geolocation) {
        try {
          await navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation(`${latitude},${longitude}`);
            },
            (error) => {
              console.error("Error fetching data", error);
            }
          );
        } catch (error) {
          console.error("Error occurred while getting location", error);
        }
      } else {
        console.error("Browser does not support geolocation.");
      }
    };

    fetchLocation();
  }, []);

  const playPause = () => {
    setPlay((prev) => !prev);
  };

  return (
    <section className="run-track min-vh-90">
      <div className="Running-area">
        <div className="map-area">
          <iframe
            title="Google maps"
            height="450"
            width="100%"
            src={`https://www.google.com/maps/embed/v1/place?key=${googleMapAPI}&q=${location}`}
            loading="lazy"
            style={{ border: 0 }}
            allowFullScreen
          ></iframe>
        </div>
        <div className="details-area">
          <div className="user-info">
            <div className="img">
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="User Profile"
                className="user-img"
              />
              <h2>John Doe</h2>
              <p>10 Sept 17:00</p>
            </div>
            <div className="runDis">
              <h1>21Km</h1>
            </div>
          </div>
          <div className="pause-resume">
            <button onClick={playPause}>
              <FontAwesomeIcon
                icon={isPlay ? faPause : faPlay}
                className="play-pause-icon"
              />
            </button>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-item">
            <h3>02:24</h3>
            <p>Duration</p>
          </div>
          <div className="stat-item">
            <h3>5'50"</h3>
            <p>Pace</p>
          </div>
          <div className="stat-item">
            <h3>400</h3>
            <p>Calories</p>
          </div>
           <div className="stat-item">
            <h3>3000</h3>
            <p>Steps</p>
          </div>
         </div>
      </div>
    </section>
  );
};

export default RunningTrack;
