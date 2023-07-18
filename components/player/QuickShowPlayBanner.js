import React, { useEffect, useState, useRef } from 'react';
import useSpotify from '@/hooks/useSpotify';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
// import state management recoil
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
} from '@/atoms/songAtom';
import { activePlaylistState } from '@/atoms/playListAtom';
import {
  showEpisodesUrisState,
} from '@/atoms/showAtom';
import {
  currentItemIdState,
  playerInfoTypeState,
  backgroundColorState,
  randomColorColorState,
  originIdState,
} from '@/atoms/otherAtoms';
// import functions
import { capitalize } from '@/lib/capitalize';
import { darkenColor } from '@/lib/darkenColor';
// import icons/images
import {
  PlayCircleIcon,
  PauseCircleIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/solid';

/**
 * Renders quick play start button for epsiode
 * @function QuickShowPlayBanner
 * @param {object} item epsiode information
 * @param {object} scrollRef ref for container scroll
 * @returns {JSX}
 */
function QuickShowPlayBanner({ item, scrollRef }) {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const [originId, setOriginId] = useRecoilState(originIdState);
  // used for quick play banner coloring
  const randomColor = useRecoilValue(randomColorColorState);
  const backgroundColor = useRecoilValue(backgroundColorState);
  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState); // used to determine what type of info to load
  const showEpisodesUris = useRecoilValue(showEpisodesUrisState); // episodes uris from a SHOW
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  // used to set play/pause icons
  const [currentItemId, setCurrentItemId] = useRecoilState(currentItemIdState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const  setCurrentSongIndex = useSetRecoilState(
    currentSongIndexState
  );
  const setActivePlaylist = useSetRecoilState(activePlaylistState);
   // used to set play/pause icons
  const [activeStatus, setActiveStatus] = useState(false);

  // show track info when play button at top of screen
  const [isVisible, setIsVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOriginId((router?.asPath).split('/').pop());
  }, [router?.asPath, setOriginId]);

  const HandleEpisodePlayPauseClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (spotifyApi.getAccessToken()) {
      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        // if track playing originates from the current page then pause
        if (currentItemId === originId && data.body?.is_playing) {
          spotifyApi
            .pause()
            .then(() => {
              setIsPlaying(false);
            })
            .catch((err) => {
              console.error('Pause failed: ');
              toast.error('Pause failed !', {
                theme: 'colored',
              });
            });
        } else {
          // or if paused, restart track (that originates from the current page)
          if (currentItemId === originId) {
            spotifyApi
              .play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch((err) => {
                console.error('Playback failed: ');
                toast.error('Playback failed !', {
                  theme: 'colored',
                });
              });
          } else {
            // otherwise no track played from the curent page yet, so start with first track
            spotifyApi.getMyCurrentPlaybackState().then((data) => {
              if (data.body?.is_playing && originId === currentTrackId) {
                spotifyApi
                  .pause()
                  .then(() => {
                    setIsPlaying(false);
                  })
                  .catch((err) => {
                    console.error('Pause failed: ');
                    toast.error('Pause failed !', {
                      theme: 'colored',
                    });
                  });
              } else {
                const index = showEpisodesUris.findIndex((element) =>
                  element.includes(item?.id)
                );
                const currentTrackIndex =
                  index < 0 || index === null ? 0 : index;

                spotifyApi
                  .play({
                    uris: [item?.uri],
                  })
                  .then(() => {
                     setPlayerInfoType('episode');
                    setIsPlaying(true);
                    setCurrentItemId(originId);
                    setCurrentTrackId(originId);
                    setCurrentSongIndex(currentTrackIndex);
                    setActivePlaylist(null); //episode playing so user's playlist null
                  })
                  .catch((err) => {
                    console.error('Playback failed: ');
                    toast.error('Playback failed !', {
                      theme: 'colored',
                    });
                  });
              }
            });
          }
        }
      });
    }
  };

  // used for sticky banner quick play button
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = scrollRef.current.scrollTop;
      setIsVisible(scrollPosition > 250); // Changed to the desired threshold
      const maxScroll = 185; // Adjust the maximum scroll value as needed
      const opacityValue = Math.min(scrollPosition / maxScroll, 1);
      setOpacity(opacityValue);
    };

    handleScroll(); // Run initially to set the text visibility

    const scrollContainer = scrollRef.current;
    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [scrollRef]);

  // used to set play/pause icons
  useEffect(() => {
    const newActiveStatus =
      (currentTrackId === item?.id && isPlaying) ||
      (currentItemId === item?.id && isPlaying) ||
      (currentItemId === originId && isPlaying);
    setActiveStatus(newActiveStatus);
  }, [currentItemId, currentTrackId, isPlaying, item?.id, originId]);

  return (
    <>
      <div className="absolute top-0 h-20 w-full z-20 flex flex-col">
        <div
          className={`bg-gradient-to-b to-black  
           ${
             backgroundColor !== null ? '' : randomColor
           } flex items-center py-4`}
          style={{
            opacity,
            background: `linear-gradient(to bottom, ${darkenColor(
              backgroundColor
            )} 90%, #000000)`,
          }}
        >
          <div
            className={` ${
              isVisible ? 'opacity-100' : 'opacity-0'
            } transition delay-100 duration-300 ease-in-out flex items-center overflow-hidden`}
          >
            {item?.type === 'episode' && (
              <>
                <button
                  className={`ml-20 isSm:ml-28 bg-gray-900 border-2 border-green-500 rounded-full text-green-500 transition delay-100 duration-300 ease-in-out hover:scale-95`}
                  onClick={(event) => {
                    HandleEpisodePlayPauseClick(event);
                  }}
                >
                  {activeStatus ? (
                    <PauseCircleIcon className="w-12 h-12" />
                  ) : (
                    <PlayCircleIcon className="w-12 h-12" />
                  )}
                </button>
                <span className="drop-shadow-text text-white text-xl font-bold p-2 hidden xxs:inline truncate pr-[100px] isMdLg:pr-[250px]">
                  {capitalize(item?.name)}
                </span>{' '}
              </>
            )}
          </div>
        </div>
      </div>

      {item?.type === 'episode' && (
        <div className="sticky top-0">
          <div className={`flex items-center py-4 w-full bg-black`}>
            <button
              className={`ml-5 isSm:ml-8 rounded-full text-green-500 transition delay-100 duration-300 ease-in-out hover:scale-95`}
              onClick={(event) => {
                HandleEpisodePlayPauseClick(event);
              }}
            >
              {activeStatus ? (
                <PauseCircleIcon className=" w-12 h-12 isSm:w-[3.5rem] isSm:h-[3.5rem]" />
              ) : (
                <PlayCircleIcon className="w-12 h-12 isSm:w-[3.5rem] isSm:h-[3.5rem]" />
              )}
            </button>
            <EllipsisHorizontalIcon className="ml-5 w-10 h-10 text-pink-swan" />
          </div>

          <hr className="border-t-1 text-gray-400 mx-4 xs:mx-[3rem]" />
        </div>
      )}
    </>
  );
}

export default QuickShowPlayBanner;
