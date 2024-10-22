import { useEffect, useState } from "react";
import "./UpdateTime.css"
const UpdateTime = () => {
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');

useEffect(() => {
    const DateFormat = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const timeString = `${formattedHours}:${minutes.toString().padStart(2, '0')}${ampm}`;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const day = now.getDate().toString().padStart(2, '0');
        const month = months[now.getMonth()];
        const dateString = `${day} ${month} ${now.getFullYear()}`;
        setCurrentTime(timeString);
        setCurrentDate(dateString);
    }
    DateFormat();
    const interval = setInterval(DateFormat, 60000);
    return () => clearInterval(interval);
}, []);
    return (
        <div className="date-time">
        <p className="date"> {currentDate}</p>
            <p className="time">{currentTime}</p>
            </div>
);
}
export default UpdateTime;
