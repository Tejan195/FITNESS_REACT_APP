import { useState, useMemo, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { GoogleMap, LoadScript, Polyline, Marker } from "@react-google-maps/api";
import "./RunningTrack.css";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
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
  const [activeDuration, setActiveDuration] = useState(0);
  const [steps, setSteps] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [stride, setStrideLength] = useState(0);
  const [pauseTime, setPauseTime] = useState(null);
  const [prevLocation, setPrevLocation] = useState(null);
  const [path, setPath] = useState([]);
  const [startingLocation, setStartingLocation] = useState(null);
  const [endingLocation, setEndingLocation] = useState(null);
  let HoldEnd = useRef(null);

  useEffect(() => {
    let watchId;
    if (isPlay) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          if (prevLocation) {
            const newDistance = calculateDistance(
              prevLocation.lat || latitude,
              prevLocation.lng || longitude,
              latitude,
              longitude
            );
            if (newDistance>0) {
              setDistance((prevDistance) => prevDistance + newDistance);
              setPrevLocation(newLocation);
              setLocation(newLocation);
              setPath((prevPath) => [...prevPath, newLocation]);
            }
          } else {
            setPrevLocation(newLocation);
            setLocation(newLocation);
            setPath([newLocation]);
          }
        },
        (error) => {
          alert(`Error Fetching location:${error.message}`);
          console.log("Fetching location error", error);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isPlay, prevLocation]);

  useEffect(() => {
    let intervalId;
    if (isPlay) {
      intervalId = setInterval(() => {
        setActiveDuration(prev => prev + 1000);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isPlay]);

  const formattedDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  useEffect(() => {
    const calculatePaceAndStride = (currentSpeed) => {
      if (currentSpeed > 0 && distance > 0) {
        const pacePerKm = (1000 / currentSpeed) / 60;
        setPace(pacePerKm.toFixed(2));
      }
      const calculatedStrideLength = currentSpeed > 0
      ? Math.max(0.45 * currentSpeed, 0.5) 
      : 0;
      setStrideLength(calculatedStrideLength);
    };
    calculatePaceAndStride(speed);
  }, [speed, distance]);

  useEffect(() => {
    const fetchLocation = async () => {
      if (navigator.geolocation) {
        try {
          await navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude, speed: currentSpeed } = position.coords;
              const initialLocation = { lat: latitude, lng: longitude };
              setLocation(initialLocation);
              setPrevLocation(initialLocation);
              setPath([initialLocation]);
              setSpeed(currentSpeed || 0);
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
    setPlay((prev) => {
      if (!prev) {
        if (startTime === null) {
          setStartTime(Date.now());
          setStartingLocation(location);
        }
        setPauseTime(null);
      } else {
        setPauseTime(Date.now());
        setEndingLocation(location);
      }
      return !prev;
    });
  };

  const holdToEnd = () => {
    if (!isPlay) {
      HoldEnd.current = setTimeout(() => {
        endWorkout();
      }, 2000);
    }
  };

  const releaseTocancel = () => {
    if (HoldEnd.current) {
      clearTimeout(HoldEnd.current);
    }
  };

  const endWorkout = () => {
    setPlay(false);
    setDistance(0);
    setStartTime(null);
    setPace(0);
    setSpeed(0);
    setSteps(0);
    setLocation(null);
    setActiveDuration(0);
    setPauseTime(null);
  }

  return (
    <section className="run-track min-vh-100">
      <div className="Running-area">
        <div className="map-area">
          <LoadScript googleMapsApiKey={googleMapAPI}>
            <GoogleMap
              center={location}
              zoom={location ? 15 : 2}
              mapContainerStyle={{ height: "450px", width: "100%" }}
            >
              {path.length > 1 && (
                <Polyline
                  path={path}
                  options={{
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWeight: 4,
                  }}
                />
              )}
              {startingLocation && (
                <Marker
                  position={startingLocation}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    scaledSize: new window.google.maps.Size(30, 30),
                  }}
                />
              )}
              {endingLocation && (
                <Marker
                  position={endingLocation}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    scaledSize: new window.google.maps.Size(30, 30),
                  }}
                />
              )}
            </GoogleMap>
          </LoadScript>
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
            <button
              onClick={playPause}
              onMouseDown={holdToEnd}
              onMouseUp={releaseTocancel}
              onTouchStart={holdToEnd}
              onTouchEnd={releaseTocancel}
            >
              <FontAwesomeIcon
                icon={isPlay ? faPause : faPlay}
                className="play-pause-icon"
              />
            </button>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-item">
            <h3>{formattedDuration(activeDuration)}</h3>
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