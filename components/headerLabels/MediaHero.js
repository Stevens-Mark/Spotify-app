import React, { useEffect } from 'react';
// import state management recoil
import { useRecoilState } from 'recoil';
import {
  backgroundColorState,
  randomColorColorState,
} from '@/atoms/otherAtoms';
// import icon/images
import Image from 'next/image';
import noImage from '@/public/images/noImageAvailable.svg';
// import functions
import { shuffle } from 'lodash'; // function used to select random color
import { msToTime } from '@/lib/time';
import { totalDuration } from '@/lib/totalTrackDuration';
import { totalAlbumDuration } from '@/lib/totalTrackDuration';
import { totalArtistTrackDuration } from '@/lib/totalTrackDuration';
import { capitalize } from '@/lib/capitalize';
import { analyseImageColor } from '@/lib/analyseImageColor.js';

// random color options for top background
const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
];

/**
 * Renders the Hero heading, image, title
 * @function MediaHeading
 * @param {object} item media information (album, playlist etc...)
 * @param {object} itemTracks (just for artists) list of their top 10 tracks
 * @returns {JSX}
 */
const MediaHeading = ({ item, itemTracks }) => {
  const [randomColor, setRandomColor] = useRecoilState(randomColorColorState);
  const [backgroundColor, setBackgroundColor] =
    useRecoilState(backgroundColorState);

  // analyse image colors for custom background & set default random background color (in case)
  useEffect(() => {
    setRandomColor(shuffle(colors).pop()); // default color tailwind (in case)
    const imageUrl = item?.images?.[0]?.url;
    if (imageUrl) {
      // custom background color (css style)
      analyseImageColor(imageUrl).then((dominantColor) => {
        setBackgroundColor(dominantColor);
      });
    } else {
      setBackgroundColor(null);
    }
  }, [item?.images, setBackgroundColor, setRandomColor]);

  return (
    <div
      className={`flex flex-col justify-end xs:flex-row xs:justify-start xs:items-center space-x-0 xs:space-x-7 h-[24rem] lg:h-[30rem] text-white py-4 px-5 xs:p-8 bg-gradient-to-b to-black ${
        backgroundColor !== null ? '' : randomColor
      }`}
      style={{
        background: `linear-gradient(to bottom, ${backgroundColor} 60%, #000000)`,
      }}
    >
      <Image
        className="h-16 w-16 xs:h-44 xs:w-44 lg:h-[14.5rem] lg:w-[14.5rem] shadow-image2 aspect-square"
        src={item?.images?.[0]?.url || noImage}
        alt=""
        width={100}
        height={100}
        style={{ objectFit: 'cover' }}
        priority
      />
      <div>
        {item && (
          <div className="drop-shadow-text">
            <span className="pt-2 text-base sm:text-xl">
              {capitalize(
                item?.album_type
                  ? item?.album_type
                  : item?.type === 'show'
                  ? 'Podcast'
                  : item?.type === 'episode'
                  ? 'Podcast Episode'
                  : item?.type
              )}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold pt-1 pb-[7px] mb-4 line-clamp-2 whitespace-wrap">
              {item?.name}
            </h1>

            {/*playlist description*/}
            {item?.type === 'playlist' && (
              <p className="text-base md:text-lg lg:text-xl xl:text-2xl mb-2 line-clamp-2">
                {item?.description}
              </p>
            )}

            {/*show*/}
            {item?.type === 'show' && (
              <span className="text-base md:text-2xl lg:text-3xl line-clamp-2">
                {capitalize(item?.publisher)}
              </span>
            )}

            {/*episode*/}
            {item?.type === 'episode' && (
              <span className="text-base sm:text-xl mt-3 mb-2 line-clamp-2">
                {capitalize(item?.show?.name)}
              </span>
            )}

            {/*playlist*/}
            {item?.type === 'playlist' && (
              <>
                <span>
                  {capitalize(item?.owner?.display_name)}&nbsp;•&nbsp;
                </span>
                <span>
                  {item?.tracks?.items?.length}{' '}
                  {item?.tracks?.items?.length > 1 ? 'songs' : 'song'},{' '}
                </span>
                <span className="text-base truncate text-pink-swan">
                  {msToTime(totalDuration(item))}
                </span>
              </>
            )}

            {/*album*/}
            {item?.type === 'album' && (
              <>
                <span>{item?.artists?.[0]?.name}&nbsp;•&nbsp;</span>
                <span>{item?.release_date.slice(0, 4)}&nbsp;•&nbsp;</span>
                <span className="text-base">
                  {item?.tracks?.items?.length}{' '}
                  {item?.tracks?.items?.length > 1 ? 'songs' : 'song'},{' '}
                </span>
                <span className="text-base truncate text-pink-swan">
                  {msToTime(totalAlbumDuration(item))}
                </span>
              </>
            )}

            {/*artist*/}
            {item?.type === 'artist' && (
              <>
                <span>
                  {(item?.followers?.total).toLocaleString()}{' '}
                  followers&nbsp;•&nbsp;
                </span>
                <span className="text-base">
                  {itemTracks?.tracks?.length}{' '}
                  {itemTracks?.tracks?.length > 1 ? 'songs' : 'song'},{' '}
                </span>
                <span className="text-base truncate text-pink-swan">
                  {msToTime(totalArtistTrackDuration(itemTracks))}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaHeading;
