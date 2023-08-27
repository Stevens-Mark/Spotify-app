import React, { useEffect, useState } from 'react';
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
import { showEpisodesUrisState, episodeDurationState } from '@/atoms/showAtom';
import {
  currentItemIdState,
  playerInfoTypeState,
  backgroundColorState,
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
 * @function QuickEpisodePlayBanner
 * @param {object} item epsiode information
 * @param {object} scrollRef ref for container scroll
 * @returns {JSX}
 */
function QuickEpisodePlayBanner({ item, scrollRef }) {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const [originId, setOriginId] = useRecoilState(originIdState);

  const backgroundColor = useRecoilValue(backgroundColorState); // used for quick play banner coloring
  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState); // used to determine what type of info to load
  const showEpisodesUris = useRecoilValue(showEpisodesUrisState); // episodes uris from a SHOW
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);

  const [currentItemId, setCurrentItemId] = useRecoilState(currentItemIdState); // used to set play/pause icons
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const setCurrentSongIndex = useSetRecoilState(currentSongIndexState);

  const setEpisodeDuration = useSetRecoilState(episodeDurationState); // used to set duration length in player fro an episode
  const setActivePlaylist = useSetRecoilState(activePlaylistState);
  const [activeStatus, setActiveStatus] = useState(false); // used to set play/pause icons

  const [isVisible, setIsVisible] = useState(false); // show track info when play button at top of screen
  const [opacity, setOpacity] = useState(0);

  // useEffect(() => {
  //   setOriginId((router?.asPath).split('/').pop());
  // }, [router?.asPath, setOriginId]);

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
                setEpisodeDuration(item?.duration_ms);
              })
              .catch((err) => {
                console.error('Playback failed: ');
                toast.error('Playback failed !', {
                  theme: 'colored',
                });
              });
          } else {
            // otherwise no track played from the curent page yet, so start with first track
            if (spotifyApi.getAccessToken()) {
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
                  // uris: [item?.uri],
                  spotifyApi
                    .play({
                      uris: showEpisodesUris,
                      offset: { position: currentTrackIndex },
                    })

                    .then(() => {
                      setPlayerInfoType('episode');
                      setIsPlaying(true);
                      setCurrentItemId(originId);
                      setCurrentTrackId(originId);
                      setCurrentSongIndex(currentTrackIndex);
                      setEpisodeDuration(item?.duration_ms);
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
        }
      });
    }
  };

  // used for sticky banner quick play button
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = scrollRef.current.scrollTop;
      setIsVisible(scrollPosition > 460); // Changed to the desired threshold
      const maxScroll = 460; // Adjust the maximum scroll value as needed
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
          className={`flex items-center py-4`}
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
                  aria-label="Play or Pause show/episode"
                >
                  {activeStatus ? (
                    <PauseCircleIcon className="w-8 h-8 xs:w-12 xs:h-12" />
                  ) : (
                    <PlayCircleIcon className="w-8 h-8 xs:w-12 xs:h-12" />
                  )}
                </button>
                <span className="drop-shadow-text text-white text-xl font-bold p-2 truncate pr-[67px] isMdLg:pr-[250px]">
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
              aria-label="Play or Pause"
            >
              {activeStatus ? (
                <PauseCircleIcon className=" w-12 h-12 isSm:w-[3.5rem] isSm:h-[3.5rem]" />
              ) : (
                <PlayCircleIcon className="w-12 h-12 isSm:w-[3.5rem] isSm:h-[3.5rem]" />
              )}
            </button>
            <EllipsisHorizontalIcon className="ml-5 w-10 h-10 text-pink-swan" />
          </div>

          <hr className="border-t-1 text-gray-400 mx-5 xs:mx-[3rem]" />
        </div>
      )}
    </>
  );
}

export default QuickEpisodePlayBanner;
