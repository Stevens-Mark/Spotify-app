import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
// import custom hooks
import useSpotify from '@/hooks/useSpotify';
import { debounce } from 'lodash';
import { millisToMinutesAndSeconds } from '@/lib/time';

/**
 * @function ProgressAndSeek
 * @param {number} currentPosition of track in ms
 * @param {number} duration total duration of track in ms
 * @returns {JSX} progress bar in player
 */
function ProgressAndSeek({ currentPosition, duration }) {
  const spotifyApi = useSpotify();
  const [seek, setSeek] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);

  // set new skip to position
  const SetNewPosition = (e) => {
    const seekValue = Number(e.target.value);
    setSeek(seekValue);
  };

      // Update the seek position when the user releases the mouse or touch
  const ExecuteNewPosition = () => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getMyDevices()
        .then((data) => {
          const activeDevice = data.body?.devices.find(
            (device) => device.is_active
          );
          console.log(
            activeDevice
              ? 'Device Found'
              : 'NO Device Found - Connect to Spotify'
          );
          if (activeDevice) {
            spotifyApi
              .seek(seek)
              .then(() => {
                // After seeking, update the current progress position
                setSeek(0);
              })
              .catch((err) => {
                console.error('Skip to new position Failed !');
                toast.error('Something went wrong !', {
                  theme: 'colored',
                });
              });
          }
        })
        .catch((err) => {
          console.error('Skip to new position Failed !');
          toast.error('Something went wrong !', {
            theme: 'colored',
          });
        });
    }
  };

  return (
    <div
      className="flex items-center w-full mt-1 pr-5"
      onBlur={() => setIsInteracting(false)}
    >
      {currentPosition ? (
        <span className="pr-2 text-xs md:text-base">
          {millisToMinutesAndSeconds(isInteracting ? seek : currentPosition)}
        </span>
      ) : (
        <span className="pr-2 text-xs md:text-base">0.00</span>
      )}
      {/* Seeks to the given position in the user’s currently playing track. */}
      <label htmlFor="seek" className="sr-only">
        Seek-to-position-control
      </label>

      <input
      id="seek"
      className="seek-input mx-3 w-full h-1 rounded-md bg-pink-swan"
        type="range"
        min={0}
        max={duration}
        value={seek || currentPosition}
        onChange={SetNewPosition}
        onMouseUp={ExecuteNewPosition}
        onTouchEnd={ExecuteNewPosition}
      />
   
      {duration ? (
        <span className="pl-2 text-xs md:text-base">
          {millisToMinutesAndSeconds(duration)}
        </span>
      ) : (
        <span className="pl-2 text-xs md:text-base">0.00</span>
      )}
    </div>
  );
}

export default ProgressAndSeek;
