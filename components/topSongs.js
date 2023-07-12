import React from 'react';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { searchResultState } from '@/atoms/searchAtom';
// import component/icons
import TopSongCard from './cards/topSongCard';
import TopSongTrack from './trackListSongs/topSongTrack';
/**
 * Renders first 4 songs from search query next to top results
 * @function TopSongs
 * @returns {JSX}
 */
function TopSongs() {
  const queryResults = useRecoilValue(searchResultState);
  const songs = queryResults?.tracks?.items;

  return (
    <div className=" flex flex-col justify-between h-60 text-sm text-pink-swan px-4 py-2 rounded-lg cursor-pointer">
      {/* 4 songs here */}
      {songs?.slice(0, 4).map((track, i) => (
        <TopSongTrack key={track.id} track={track} order={i} />
      ))}
    </div>
  );
}

export default TopSongs;
