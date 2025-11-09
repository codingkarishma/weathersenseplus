import React from 'react'
import "../styles/historyCard.css";
const HistoryCard = ({history}) => {
    if(!history || history.length ===0){
        return null;
    }
  return (
    <div className="history-card">
        <h3 className='history-title'>📜 Recent Weather History</h3>
        <ul className="history-list">
            {
                history.map((entry,idx)=>(
                    <li key={idx} className="history-item">
                        <span className="city">{entry.city}</span>
                        <span className="temp">{entry.temp}°C</span>
                        <span className="humid">{entry.humidity}%</span>
                        <span className="time">{entry.time}</span>
                    </li>
                ))
            }
        </ul>
    </div>
  );
};

export default HistoryCard;
