import React, { useState } from 'react';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { showEpisodesListState } from '@/atoms/showAtom';
// import component/icons
import ShowTrack from './showTrack';

/**
 * Renders the list of episodes in a show
 * @function ShowTracks
 * @returns {JSX}
 */
function ShowTracks() {
  const showEpisodesList = useRecoilValue(showEpisodesListState);
  const [number, setNumber] = useState(25);

  const toggleNumber = () => {
    const newNumber = number === 25 ? 50 : 25;
    setNumber(newNumber);
  };

  return (
    <>
      <div className="flex flex-col">
        {showEpisodesList?.slice(0, number).map((track, i) => (
          <ShowTrack key={`${track.id}-${i}`} track={track} order={i} />
        ))}
        <button
          className="self-start mt-3 px-5 text-sm md:text-xl text-white hover:text-green-500"
          onClick={toggleNumber}
        >
          {number === 25 ? '... See More' : 'See Less'}
        </button>
      </div>
    </>
  );
}

export default ShowTracks;
