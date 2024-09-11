
import { useMemo } from 'react';
import './Map.css';

function Map() {
  const googleMapAPI = useMemo(()=>import.meta.env.VITE_API_KEY,[]);
  return (
    <div className="map-container">
      <iframe
        title="Google Map"
        width="100%"
        height="450"
        style={{ border: '0' }}
        loading="lazy"
        allowFullScreen
        src={`https://www.google.com/maps/embed/v1/place?key=${googleMapAPI}&q=bbsr,india`}
      ></iframe>
      <br />
      <small>
        <a
          href="https://www.google.com/maps?q=bbsr,india&z=15"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Larger Map
        </a>
      </small>
    </div>
  );
}

export default Map;
