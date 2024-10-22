import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UpdateTime from "../utilily/UpdateTime";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { GoogleMap, Polyline, LoadScript } from "@react-google-maps/api";
import { throttle } from "lodash";
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
const LIBRARIES = ["marker"];
const MAX_SPEED_KMH = 30;
const TIME_WINDOW_SECONDS = 60;
const MIN_ACCURACY = 30;
const DISTANCE_THRESHOLD = 5;
const POSITION_UPDATE_INTERVAL = 1000;
const MAX_POSITION_HISTORY = 60;
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
  const [strideLength, setStrideLength] = useState(0);
  const [pauseTime, setPauseTime] = useState(null);
  const [calorie, setCalorie] = useState(0);
  const [direction, setDirection] = useState(0);
  const [prevLocation, setPrevLocation] = useState(null);
  const [path, setPath] = useState([]);
  const [date, setDate] = useState(null);
  const [startingLocation, setStartingLocation] = useState(null);
  const [endingLocation, setEndingLocation] = useState(null);
  const lastValidPosition = useRef(null);
  const MapId = 'e481db0b4a053450';
  const HoldEnd = useRef(null);
  const mapRef = useRef(null);
  const starMarkertRef = useRef(null);
  const endMarkerRef = useRef(null);
  const throttleRef = useRef(null);
  const watchIdRef = useRef(null);
  const intervalIdRef = useRef(null);
  const prevLocationRef = useRef(null);
  const prevAccelerationRef = useRef(0);
  const lastStepTimeRef = useRef(0);
  const positionHistoryRef = useRef([]);

  const updatePosition = useCallback(
    throttle((newLocation) => {
      prevLocationRef.current = newLocation;
      setLocation(newLocation);
      setPath((prevPath) => [...prevPath, newLocation]);
    }, POSITION_UPDATE_INTERVAL), []
  );
    const isValidPosition = useCallback((newPosition) => {
    if (!prevLocationRef.current || positionHistoryRef.current.length === 0) return true;

    const lastPosition = positionHistoryRef.current[positionHistoryRef.current.length - 1];
    const timeDiff = (newPosition.timestamp - lastPosition.timestamp) / 1000;
    const distance = calculateDistance(
      lastPosition.lat,
      lastPosition.lng,
      newPosition.lat,
      newPosition.lng
    );
    const speedKmh = (distance / timeDiff) * 3.6; 

    return speedKmh <= MAX_SPEED_KMH && newPosition.accuracy <= MIN_ACCURACY && distance> DISTANCE_THRESHOLD;
  }, []);
 useEffect(() => {
   if (isPlay) return; {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy, timestamp } = position.coords;
          const newLocation = { lat: latitude, lng: longitude, accuracy, timestamp };
          
          if (isValidPosition(newLocation)) {
            if (prevLocationRef.current) {
              const newDistance = calculateDistance(
                prevLocationRef.current.lat,
                prevLocationRef.current.lng,
                latitude,
                longitude
              );
              if (newDistance > 0) {
                setDistance((prevDistance) => prevDistance + newDistance);
                updatePosition(newLocation);
                lastValidPosition.current = newLocation;
              }
            } else {
              updatePosition(newLocation);
              lastValidPosition.current = newLocation;
            }

            positionHistoryRef.current = [
              ...positionHistoryRef.current.slice(-MAX_POSITION_HISTORY),
              newLocation,
            ];
          } 
            else if (lastValidPosition.current) {
              updatePosition(lastValidPosition.current);
            }
          },
        (error) => {
          console.log("Fetching location error", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout:27000,
        }
      );
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        updatePosition.cancel();
      }
    };
  }, [isPlay, isValidPosition,updatePosition]);


  useEffect(() => {
    if (!isPlay) return; {
      intervalIdRef.current = setInterval(() => {
        setActiveDuration((prev) => prev + 1000);
      }, 1000);
    }
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    }
  }, [isPlay]);


  const formattedDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

 useEffect(() => {
    if (speed > 0) {
      const pacePerKm = (speed * 60) / 1000;
      setPace(pacePerKm.toFixed(2));
      setStrideLength(Math.max(0.45 * speed, 0.5));
    }
  }, [speed]);


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
 useEffect(() => {
    if (!isPlay) return;

    const handleStepsMotion = throttle((event) => {
      const { x, y, z } = event.acceleration;
      if (!x || !y || !z) return;

      const accelerationMagnitude = Math.sqrt(x * x + y * y + z * z);
      const currentTime = Date.now();
      
      if (currentTime - lastStepTimeRef.current < 250) return;

      if (
        accelerationMagnitude > 9.81 &&
        accelerationMagnitude > prevAccelerationRef.current &&
        strideLength > 0
      ) {
        setSteps((prev) => prev + 1);
        setDistance((prev) => prev + strideLength);
        lastStepTimeRef.current = currentTime;
      }
      
      prevAccelerationRef.current = accelerationMagnitude;
    }, 100);

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleStepsMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleStepsMotion);
      handleStepsMotion.cancel();
    };
  }, [isPlay, strideLength]);
  useEffect(() => {
    if (!isPlay) return;
    const handleOrientation = (event) => {
      const { alpha } = event;
      if (alpha !== null) {
        setDirection(alpha.toFixed(2));
      } else if (event.webkitCompassHeading) {
        setDirection(event.webkitCompassHeading.toFixed(2));
      }
    };
    const setUpEventListener = () => {
      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation);
      } else {
        console.warn("DeviceOrientation is not supported on this device");
      }
    };
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(Permission => {
          if (Permission === 'granted') {
            setUpEventListener();
          } else {
            console.warn("Permission denied");
          }
        })
        .catch(console.error);
    } else {
      setUpEventListener();
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, [isPlay]);
  useEffect(() => {
    const userWeight = 70;
    if (pace>0 && distance>0) {
      const METVALUE = pace > 6 ? 9.8 : 7.0;
      const durationHrs = activeDuration / 3600000;
      const caloriesCut = userWeight * METVALUE * durationHrs;
      setCalorie(caloriesCut.toFixed(0));
    }
  }, [pace, distance, activeDuration]);
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

  const endWorkout = useCallback(() => {
    setPlay(false);
    setDistance(0);
    setStartTime(null);
    setPace(0);
    setSpeed(0);
    setSteps(0);
    setActiveDuration(0);
    setPauseTime(null);
    setCalorie(0);
     positionHistoryRef.current = [];
    prevLocationRef.current = null;
    lastValidPosition.current = null;
  }, []);
  useEffect(() => {
    const loadMarker = async () => {
      if ( mapRef.current) {
        try {
          const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
          if (startingLocation) {
            const startPin = new PinElement({
              background: "#00FF00",
              glyphColor: "#FFFFFF",
              borderColor: "#00CC00",
            });
            starMarkertRef.current = new AdvancedMarkerElement({
              map: mapRef.current,
              position: startingLocation,
              content: startPin.element,
            });
          }
          if (endingLocation) {
            const endPin = new PinElement({
              background: "#FF0000",
              glyphColor: "#FFFFFF",
              borderColor: "#CC0000",
            });
            endMarkerRef.current = new AdvancedMarkerElement({
              map: mapRef.current,
              position: endingLocation,
              content: endPin.element,
            });
          }
        } catch (error) {
          console.error("Error loading marker", error);
        }
      }
    };
    loadMarker();
  }, [startingLocation, endingLocation, isPlay]);

return (
    <LoadScript googleMapsApiKey={googleMapAPI} libraries={LIBRARIES}>
      <section className="run-track min-vh-100">
        <div className="Running-area">
        <div className="map-area">
          {!location ? (
            <div className="loader-container">
              <div className="loader">
                <div className="loader__bar"></div>
                <div className="loader__bar"></div>
                <div className="loader__bar"></div>
                <div className="loader__bar"></div>
                <div className="loader__bar"></div>
                <div className="loader__ball"></div>
              </div>
            </div>
          ) : (
            <GoogleMap
              center={location}
              zoom={location ? 15 : 2}
              mapContainerStyle={{ height: "450px", width: "100%" }}
              onLoad={(map) => (mapRef.current = map)}
              options={{ MapId }}
            >
              {path.length > 1 && (
                <Polyline
                  path={path}
                  options={{
                    strokeColor: "#4CAF50",
                    strokeOpacity: 1.0,
                    strokeWeight: 4,
                  }}
                />
              )}
            </GoogleMap>
          )}
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
             <UpdateTime/>
              </div>
              <div className="runDis">
                <h1>{(distance / 1000).toFixed(1)}km</h1>
              </div>
            </div>
            <div className="pause-resume">
              <button
                className={`pause-resume-btn ${isPlay ? "play" : "pause"}`}
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
            <h3>{ calorie }</h3>
              <p>Calories</p>
            </div>
            <div className="stat-item">
              <h3>{steps}</h3>
              <p>Steps</p>
            </div>
          </div>
        </div>
      </section>
    </LoadScript>
  );
};

export default RunningTrack;