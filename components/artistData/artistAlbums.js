import React, { useEffect, useState } from 'react';
import useSpotify from '@/hooks/useSpotify';

function ArtistAlbums({artistId}) {
  const spotifyApi = useSpotify();
  const [discs, setDiscs] = useState(null)

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getArtistAlbums(artistId).then(
        function (data) {
          console.log('Artist albums', data.body);
          setDiscs(data.body)
        },
        function (err) {
          console.error(err);
        }
      );
    }
  }, [artistId, spotifyApi]);

  return <div></div>;
}

export default ArtistAlbums;
