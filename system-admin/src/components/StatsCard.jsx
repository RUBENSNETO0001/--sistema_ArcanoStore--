import React from 'react';
import '../style/Dashboard.css';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className={`stats-card ${color}`}>
      <div className="stats-content">
        <h3>{title}</h3>
        <p className="stats-value">{value}</p>
      </div>
      <div className="stats-icon">
        {icon}
      </div>
    </div>
  );
};

export default StatsCard;