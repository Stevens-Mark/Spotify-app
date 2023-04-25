import { playListState } from '@/atoms/playListAtom';
import React from 'react';
import { useRecoilValue } from 'recoil';
import Song from './Song';

function Songs() {
  const playlist = useRecoilValue(playListState);

  return (
    <div className="p-8 flex flex-col space-y-1 bp-28 text-white">
      {playlist?.tracks.items.map((track, i) => (
        <Song key={`${track.track.id}-${i}`} track={track} order={i} />
      ))}
    </div>
  );
}

export default Songs;
