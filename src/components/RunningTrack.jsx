import { useState, useMemo, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import "./RunningTrack.css";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Radius of Earth in meters
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const RunningTrack = () => {
  const [location, setLocation] = useState(null);
  const googleMapAPI = useMemo(() => import.meta.env.VITE_API_KEY, []);
  const [isPlay, setPlay] = useState(false);
  const [distance, setDistance] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [pace, setPace] = useState(0);
  const [duration, setDuration] = useState(0);
  const [steps, setSteps] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [stride, setStrideLength] = useState(0);

  useEffect(() => {
    let watchId;
    let prevCoords = null;
    if (isPlay) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude},${longitude}`);
          if (prevCoords) {
            const newDistance = calculateDistance(
              prevCoords.latitude,
              prevCoords.longitude,
              latitude,
              longitude
            );
            setDistance((prevDistance) => prevDistance + newDistance);
          }
          prevCoords = { latitude, longitude };
        },
        (error) => console.log("Fetching location error", error),
        { enableHighAccuracy: true }
      );
    }
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isPlay]);

  useEffect(() => {
    let intervalId;
    if (isPlay && startTime) {
      intervalId = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        setDuration(elapsedTime);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isPlay, startTime, distance]);

  const calculatePaceAndStride = (currentSpeed) => {
    if (currentSpeed > 0 && distance > 0) {
      const pacePerKm = (1000 / currentSpeed) / 60;
      setPace(pacePerKm.toFixed(2));
    }
    const calculatedStrideLength =
      currentSpeed > 0 ? 1.3 * currentSpeed : 0.45 * currentSpeed;
    setStrideLength(calculatedStrideLength);
  };

  useEffect(() => {
    const fetchLocation = async () => {
      if (navigator.geolocation) {
        try {
          await navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude, speed: currentSpeed } = position.coords;
              setLocation(`${latitude},${longitude}`);
              setSpeed(currentSpeed || 0);
              calculatePaceAndStride(currentSpeed);
            },
            (error) => {
              console.error("Error fetching location", error);
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
  }, [isPlay]);

  const playPause = () => {
    setPlay((prev) => !prev);
    if (!isPlay) {
      setStartTime(Date.now());
      setDistance(0);
    }
  };

  return (
    <section className="run-track min-vh-100">
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
              <h1>{distance.toFixed(2)} meters</h1>
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
            <h3>{duration ? duration.toFixed(2) : '00:00'}</h3>
            <p>Duration</p>
          </div>
          <div className="stat-item">
            <h3>{pace}'/km</h3>
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
