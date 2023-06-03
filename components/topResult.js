import React, { useEffect } from 'react';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { topResultState } from '@/atoms/searchAtom';
import TopResultCard from '@/components/cards/topResultCard';

/**
 * Identifies the type: artist, tracks etc... of the search
 * & calls for corresponding card to be rendered 
 * @function TopResult
 * @returns {JSX}
 */
function TopResult() {
  const topResult = useRecoilValue(topResultState);
  let type = null;

  switch (true) {
    case topResult.hasOwnProperty('tracks'):
      type = 'tracks';
      break;
    case topResult.hasOwnProperty('playlists'):
      type = 'playlists';
      break;
    case topResult.hasOwnProperty('albums'):
      type = 'albums';
      break;
    case topResult.hasOwnProperty('artists'):
      type = 'artists';
      break;
    default:
      break;
  }

  return (
    <div>
      <>
        {type === 'tracks' && (
          <TopResultCard type={'track'} item={topResult?.tracks?.items[0]} />
        )}

        {type === 'playlists' && (
          <TopResultCard
            type={'playlist'}
            item={topResult?.playlists?.items[0]}
          />
        )}

        {type === 'albums' && (
          <TopResultCard type={'album'} item={topResult?.albums?.items[0]} />
        )}

        {type === 'artists' && (
          <TopResultCard type={'artist'} item={topResult?.artists?.items[0]} />
        )}
      </>
    </div>
  );
}

export default TopResult;
