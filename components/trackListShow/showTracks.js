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

  return (
    <>
      <div className="flex flex-col">
        {showEpisodesList?.map((track, i) => (
          <ShowTrack key={`${track.id}-${i}`} track={track} order={i} />
        ))}
      </div>
    </>
  );
}

export default ShowTracks;
