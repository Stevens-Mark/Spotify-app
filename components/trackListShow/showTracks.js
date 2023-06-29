import React from 'react';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { showEpisodesListState } from '@/atoms/showAtom';
// import component/icons
import EpisodeCard from '@/components/cards/episodeCard';

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
          <EpisodeCard
            key={`${track?.id}-${i}`}
            whichList={'show'}
            track={track}
            order={i}
          />
        ))}
      </div>
    </>
  );
}

export default ShowTracks;
