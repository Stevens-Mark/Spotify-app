import React from 'react';

const TrackProgressBar = ({ resumePosition, duration }) => {
  const progressPercentage = (resumePosition / duration) * 100;

  return (
    <div className="mx-3 h-1 w-20 rounded-md bg-pink-swan">
      <div className="h-1 rounded-md bg-white" style={{ width: `${progressPercentage}%` }}></div>
    </div>
  );
};

export default TrackProgressBar;
