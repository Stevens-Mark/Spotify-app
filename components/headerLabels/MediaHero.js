import React, { useEffect, useState } from 'react';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState } from 'recoil';
import {
  backgroundColorState,
} from '@/atoms/otherAtoms';
// import icon/images
import Image from 'next/image';
import noImage from '@/public/images/user_noImage.svg';
import noCoverImage from '@/public/images/noImageAvailable.svg';
// import functions
import { shuffle } from 'lodash'; // function used to select random color
import { msToTime } from '@/lib/time';
import {
  totalDuration,
  totalAlbumDuration,
  totalArtistTrackDuration,
  totalCollectionTrackDuration,
} from '@/lib/totalTrackDuration';
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
  const spotifyApi = useSpotify();

  const [backgroundColor, setBackgroundColor] =
    useRecoilState(backgroundColorState);
  const [userImage, setUserImage] = useState(null);

  // analyse image colors for custom background
  useEffect(() => {
    const imageUrl = item?.images?.[0]?.url;
    if (imageUrl) {
      // custom background color (css style)
      analyseImageColor(imageUrl).then((dominantColor) => {
        setBackgroundColor(dominantColor);
      });
    } else {
      setBackgroundColor(null);
    }
  }, [item?.images, setBackgroundColor]);

  useEffect(() => {
    // if liked songs or playlist - Get owner's image
    if (spotifyApi.getAccessToken()) {
      if (item?.owner?.id) {
        spotifyApi
          .getUser(item?.owner?.id)

          .then((data) => {
            setUserImage(data?.body?.images?.[0]?.url);
          })
          .catch((err) => console.error('Owner image retrieval failed:'));
      }

      // otherwise if an Album - Get artist's image
      if (item?.artists?.[0]?.id) {
        spotifyApi
          .getArtist(item?.artists?.[0]?.id)
          .then((data) => {
            setUserImage(data?.body?.images?.[0]?.url);
          })
          .catch((err) => console.error('Artist image retrieval failed:'));
      }
    }
  }, [item?.artists, item?.owner?.id, spotifyApi]);

  return (
    <div
      className={`flex flex-col justify-end xs:flex-row xs:justify-start xs:items-center space-x-0 xs:space-x-7 h-[24rem] lg:h-[30rem] text-white py-4 px-5 xs:p-8`}
      style={{
        background: `linear-gradient(to bottom, ${backgroundColor} 60%, #000000)`,
      }}
    >
      <Image
        className="h-16 w-16 xs:h-44 xs:w-44 lg:h-[14.5rem] lg:w-[14.5rem] shadow-image2 aspect-square"
        src={item?.images?.[0]?.url || noCoverImage}
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
                  : item?.type === 'collection'
                  ? 'Playlist'
                  : item?.type
              )}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold pt-1 pb-[7px] mb-4 line-clamp-2 whitespace-wrap">
              {item?.name}
            </h1>

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

            {/*playlist description*/}
            {item?.type === 'playlist' && (
              <p className="text-base md:text-lg lg:text-xl xl:text-2xl mb-2 line-clamp-2">
                {item?.description}
              </p>
            )}

            <div className="flex items-center flex-wrap">
              {/* Add owner or artist image if not show or episode  */}
              {item?.type !== 'show' &&
                item?.type !== 'episode' &&
                item?.type !== 'artist' && (
                  <Image
                    className="h-6 w-6 rounded-full shadow-image2 aspect-square mr-1"
                    src={userImage || noImage}
                    alt=""
                    width={100}
                    height={100}
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                )}

              {/*playlist*/}
              {item?.type === 'playlist' && (
                <>
                  <span>
                    {capitalize(item?.owner?.display_name)}&nbsp;•&nbsp;
                  </span>
                  {item?.followers?.total !== 0 && (
                    <span>
                      {(item?.followers?.total).toLocaleString()}{' '}
                      followers&nbsp;•&nbsp;
                    </span>
                  )}
                  <span>
                    {item?.tracks?.items?.length}{' '}
                    {item?.tracks?.items?.length > 1 ? 'songs' : 'song'}, &nbsp;
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
                  <span>{item?.release_date?.slice(0, 4)}&nbsp;•&nbsp;</span>
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
                    {itemTracks?.tracks?.length > 1 ? 'songs' : 'song'}, &nbsp;
                  </span>
                  <span className="text-base truncate text-pink-swan">
                    {msToTime(totalArtistTrackDuration(itemTracks))}
                  </span>
                </>
              )}

              {/*collection - liked songs*/}
              {item?.type === 'collection' && (
                <>
                  <span>
                    {capitalize(item?.owner?.display_name)}&nbsp;•&nbsp;
                  </span>
                  <span>
                    {item?.total} {item?.total > 1 ? 'songs' : 'song'}, &nbsp;
                  </span>
                  <span className="text-base truncate text-pink-swan">
                    {msToTime(totalCollectionTrackDuration(item))}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaHeading;
