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
  const progressPercentage = (currentPosition / duration) * 100;
  const [seek, setSeek] = useState(0); // seek functionality
  const [isInteracting, setIsInteracting] = useState(false);

 
  const debounceAdjustSeek = useMemo(
    () =>
      debounce((seek) => {
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
                spotifyApi.seek(seek).catch((err) => {
                  console.error('Something went wrong !');
                  toast.error('Something went wrong !', {
                    theme: 'colored',
                  });
                });
              }
            })
            .catch((err) => {
              console.error('Something went wrong !');
              toast.error('Something went wrong !', {
                theme: 'colored',
              });
            });
        }
      }, 500),
    [spotifyApi]
  );

  useEffect(() => {
    if (seek > 0 && seek < duration) {
      debounceAdjustSeek(seek);
    }
  }, [debounceAdjustSeek, duration, seek]);

  return (
    <div className="flex items-center w-full mt-1 pr-5">
      {currentPosition ? (
        <span className="pr-2 text-xs md:text-base">
          {millisToMinutesAndSeconds(isInteracting ? seek : currentPosition)}
        </span>
      ) : (
        <span className="pr-2 text-xs md:text-base">0.00</span>
      )}
      {/* 
      <span className="mx-3 h-1 w-full rounded-md bg-pink-swan">
        <div
          className="h-1 rounded-md bg-white"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </span> */}

      {/* Seeks to the given position in the user’s currently playing track. */}
      <label htmlFor="seek" className="sr-only">
        Seek-to-position-control
      </label>
      <input
        id="seek"
        className="seek-input mx-3 w-full h-1 rounded-md bg-pink-swan"
        type="range"
        value={isInteracting ? seek : currentPosition}
        onChange={(e) => {
          setSeek(Number(e.target.value));
          setIsInteracting(true);
        }}
        onMouseUp={() => setIsInteracting(false)}
        onTouchEnd={() => setIsInteracting(false)}
        min={0}
        max={duration}
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
