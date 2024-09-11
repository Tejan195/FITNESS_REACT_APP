import { useState, useMemo, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlay,faPause} from "@fortawesome/free-solid-svg-icons";
import "./RunningTrack.css";
const RunningTrack = () => {
  const [location,setlocation]= useState(null);
  const googleMapAPI = useMemo(()=>import.meta.env.VITE_API_KEY,[]);
  const [isplay,setplay]= useState(false);
  useEffect(()=>{
    const livelocation = (position)=>{
      const {latitude,longitude}=position.coords;
    setlocation(`${latitude},${longitude}`);
    };
    const handleError =(error)=>{
      console.error("Error fetching data",error);
    };
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(livelocation,handleError);
    }else{
      console.error("Error Fetching location or browser doesnt support");
    }
  },[]);
const playpause=()=>{
  setplay((prev)=>!prev);
}
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
          style={{border:0}}
          allowFullScreen
          >

          </iframe>
        </div>
        <div className="details-area">
          <div className="user-info">
            <div className="img">
          <img
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt="User Profile"
            className="user-img"
          />
           <h2>john doe</h2>
           <p>10 Sept 17:00</p></div>
          <div className="runDis"> 
            <h1>21Km</h1></div>
          </div>
          <div className="pause-resume">
            <button onClick={playpause}>
          <FontAwesomeIcon  icon={isplay ? faPause: faPlay}
          className="play-pause-icon" />
          </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RunningTrack
