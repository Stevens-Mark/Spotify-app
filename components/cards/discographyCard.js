import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import useSpotify from '@/hooks/useSpotify';
import { useSession } from 'next-auth/react';
// import state management recoil
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { artistsDiscographyState } from '@/atoms/artistAtom';
import { currentItemIdState } from '@/atoms/otherAtoms';
import { albumIdState } from '@/atoms/albumAtom';
// import { isPlayState } from '@/atoms/songAtom';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
} from '@/atoms/songAtom';
// import functions
import { capitalize } from '@/lib/capitalize';
import noImage from '@/public/images/noImageAvailable.svg';
import { PlayCircleIcon, PauseCircleIcon } from '@heroicons/react/24/solid';
import TitleTimeLabel from '@/components/headerLabels/titleTime';
import DiscographyTrack from '../discography/discographyTrack';
/**

 * @function DiscographyCard
 * @param {object} item 
 * @returns {JSX}
 */
function DiscographyCard({ item }) {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [activeStatus, setActiveStatus] = useState(false);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const [currentItemId, setCurrentItemId] = useRecoilState(currentItemIdState); // used to set play/pause icons
  const [albumTracks, setAlbumTracklist] = useState(null);
  const [currentAlbumId ,setCurrentAlbumId] = useRecoilState(albumIdState);

  // useEffect(() => {
  //   spotifyApi.getAlbumTracks(item?.id, { limit: 50 }).then(
  //     function (data) {
  //       setAlbumTracklist(data.body?.items)
  //     },
  //     function (err) {
  //       console.log('Something went wrong!', err);
  //     }
  //   );
  // }, [item?.id, spotifyApi]);

  
// fetch album tracklist
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getAlbum(item?.id).then(
        function (data) {
          setAlbumTracklist(data.body);
        },
        function (err) {
          console.error(err);
        }
      );
    }
  }, [item?.id, spotifyApi, session]);

// album quickplay button update to active or not 
useEffect(() => {
  const newActiveStatus = item?.id === currentAlbumId && isPlaying;
  setActiveStatus(newActiveStatus);
}, [currentAlbumId, isPlaying, item?.id]);

  return (
    <div>
      <div className="grid grid-cols-[max-content_1fr] items-center p-2 text-white pr-12">
        <div className="flex items-center">
          <Image
            className="ml-4 xs:ml-8 aspect-square shadow-image w-20 h-20 md:w-28 md:h-28"
            src={item?.images?.[0]?.url || noImage}
            alt=""
            width={100}
            height={100}
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Item details */}
        <div className="ml-4">
          <div className="capitalize text-xl md:text-2xl line-clamp-1">
            {item?.name}
          </div>
          <div className="text-pink-swan mt-0 md:mt-2">
            <span>{capitalize(item?.album_type)}&nbsp;•&nbsp;</span>
            <span>{item?.release_date?.slice(0, 4)}&nbsp;•&nbsp;</span>
            <span>
              {albumTracks?.tracks?.items?.length}&nbsp;
              {albumTracks?.tracks?.items?.length === 1 ? 'Song' : 'Songs'}
            </span>
          </div>
          <button
            className="mt-1 md:mt-3"
            onClick={() => {
              if (activeStatus) {
                // Pause logic: Set isPlaying to false
                setIsPlaying(false);
                setCurrentItemId(null); // Clear the currently playing item
              } else {
                // Play logic: Set isPlaying to true and set the current item ID
                setIsPlaying(true);
                setCurrentItemId(item?.id);
              }
            }}
            aria-label="Play or Pause"
          >
            {activeStatus ? (
              <PauseCircleIcon className="w-8 h-8 md:w-10 md:h-10 transition delay-100 duration-300 ease-in-out hover:scale-110 focus:scale-110 " />
            ) : (
              <PlayCircleIcon className="w-8 h-8 md:w-10 md:h-10 transition delay-100 duration-300 ease-in-out hover:scale-110 focus:scale-110" />
            )}
          </button>
        </div>
      </div>
      <div className="text-white p-0 xs:px-8 flex items-center w-full justify-between">
        <TitleTimeLabel />
      </div>
      <hr className="border-t-1 text-gray-400 mx-5 xs:mx-[3rem]" />
      <section>
        <h2 className="sr-only">Track List</h2>
        <div className="p-0 xs:p-8 flex flex-col space-y-1 bp-28 text-white">
          {albumTracks?.tracks?.items?.map((track, i) => (
            <DiscographyTrack
              key={`${track.id}-${i}`}
              track={track}
              order={i}
              currentAlbumId={item?.id}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default DiscographyCard;
