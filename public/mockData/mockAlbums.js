const mockAlbumData = [
  {
    album_group: 'album',
    album_type: 'album',
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/1lJhME1ZpzsEa5M0wW6Mso',
        },
        href: 'https://api.spotify.com/v1/artists/1lJhME1ZpzsEa5M0wW6Mso',
        id: '1lJhME1ZpzsEa5M0wW6Mso',
        name: 'Charlotte de Witte',
        type: 'artist',
        uri: 'spotify:artist:1lJhME1ZpzsEa5M0wW6Mso',
      },
    ],
    available_markets: [],
    external_urls: {
      spotify: 'https://open.spotify.com/album/6idN8ZmlZoc0AYMIEH0vue',
    },
    href: 'https://api.spotify.com/v1/albums/6idN8ZmlZoc0AYMIEH0vue',
    id: '6idN8ZmlZoc0AYMIEH0vue',
    images: [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b273e23812c4c24522f8c3d6e693',
        width: 640,
      },
    ],
    name: 'Mixmag Presents Charlotte de Witte (DJ Mix)',
    release_date: '2021-07-30',
    release_date_precision: 'day',
    total_tracks: 14,
    type: 'album',
    uri: 'spotify:album:6idN8ZmlZoc0AYMIEH0vue',
  },
  {
    album_group: 'single',
    album_type: 'single',
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/1lJhME1ZpzsEa5M0wW6Mso',
        },
        href: 'https://api.spotify.com/v1/artists/1lJhME1ZpzsEa5M0wW6Mso',
        id: '1lJhME1ZpzsEa5M0wW6Mso',
        name: 'Charlotte de Witte',
        type: 'artist',
        uri: 'spotify:artist:1lJhME1ZpzsEa5M0wW6Mso',
      },
    ],
    available_markets: [],
    external_urls: {
      spotify: 'https://open.spotify.com/album/6L9vJcQPmdPQC7KYAgpk3k',
    },
    href: 'https://api.spotify.com/v1/albums/6L9vJcQPmdPQC7KYAgpk3k',
    id: '6L9vJcQPmdPQC7KYAgpk3k',
    images: [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b2735190125bf407c3d989f97e0f',
        width: 640,
      },
    ],
    name: 'Overdrive EP',
    release_date: '2023-05-17',
    release_date_precision: 'day',
    total_tracks: 4,
    type: 'album',
    uri: 'spotify:album:6L9vJcQPmdPQC7KYAgpk3k',
  },
  {
    album_group: 'single',
    album_type: 'single',
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/1lJhME1ZpzsEa5M0wW6Mso',
        },
        href: 'https://api.spotify.com/v1/artists/1lJhME1ZpzsEa5M0wW6Mso',
        id: '1lJhME1ZpzsEa5M0wW6Mso',
        name: 'Charlotte de Witte',
        type: 'artist',
        uri: 'spotify:artist:1lJhME1ZpzsEa5M0wW6Mso',
      },
    ],
    available_markets: [],
    external_urls: {
      spotify: 'https://open.spotify.com/album/1DrCbrC5FRwKaflQW3nhIU',
    },
    href: 'https://api.spotify.com/v1/albums/1DrCbrC5FRwKaflQW3nhIU',
    id: '1DrCbrC5FRwKaflQW3nhIU',
    images: [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b273229cb9efc445c146c23da002',
        width: 640,
      },
    ],
    name: 'High Street',
    release_date: '2023-04-21',
    release_date_precision: 'day',
    total_tracks: 2,
    type: 'album',
    uri: 'spotify:album:1DrCbrC5FRwKaflQW3nhIU',
  },
  {
    album_group: "single",
    album_type: "single",
    artists: [
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/1lJhME1ZpzsEa5M0wW6Mso"
        },
        href: "https://api.spotify.com/v1/artists/1lJhME1ZpzsEa5M0wW6Mso",
        id: "1lJhME1ZpzsEa5M0wW6Mso",
        name: "Charlotte de Witte",
        type: "artist",
        uri: "spotify:artist:1lJhME1ZpzsEa5M0wW6Mso"
      }
    ],
    available_markets: [], 
    external_urls: {
      spotify: "https://open.spotify.com/album/6h4f0Fq4di449j06qjBt3O"
    },
    href: "https://api.spotify.com/v1/albums/6h4f0Fq4di449j06qjBt3O",
    id: "6h4f0Fq4di449j06qjBt3O",
    images: [], 
    name: "Apollo EP",
    release_date: "2022-10-14",
    release_date_precision: "day",
    total_tracks: 4,
    type: "album",
    uri: "spotify:album:6h4f0Fq4di449j06qjBt3O"
  },
  {
    album_group: "single",
    album_type: "single",
    artists: [
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/1lJhME1ZpzsEa5M0wW6Mso"
        },
        href: "https://api.spotify.com/v1/artists/1lJhME1ZpzsEa5M0wW6Mso",
        id: "1lJhME1ZpzsEa5M0wW6Mso",
        name: "Charlotte de Witte",
        type: "artist",
        uri: "spotify:artist:1lJhME1ZpzsEa5M0wW6Mso"
      }
    ],
    available_markets: [], 
    external_urls: {
      spotify: "https://open.spotify.com/album/4hLx8gxka0a3rYc2sBN3fQ"
    },
    href: "https://api.spotify.com/v1/albums/4hLx8gxka0a3rYc2sBN3fQ",
    id: "4hLx8gxka0a3rYc2sBN3fQ",
    images: [], 
    name: "Universal Consciousness EP",
    release_date: "2022-04-27",
    release_date_precision: "day",
    total_tracks: 4,
    type: "album",
    uri: "spotify:album:4hLx8gxka0a3rYc2sBN3fQ"
  },
  {
    album_group: "single",
    album_type: "single",
    artists: [
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/1lJhME1ZpzsEa5M0wW6Mso"
        },
        href: "https://api.spotify.com/v1/artists/1lJhME1ZpzsEa5M0wW6Mso",
        id: "1lJhME1ZpzsEa5M0wW6Mso",
        name: "Charlotte de Witte",
        type: "artist",
        uri: "spotify:artist:1lJhME1ZpzsEa5M0wW6Mso"
      }
    ],
    available_markets: [], 
    external_urls: {
      spotify: "https://open.spotify.com/album/6h4f0Fq4di449j06qjBt3O"
    },
    href: "https://api.spotify.com/v1/albums/6h4f0Fq4di449j06qjBt3O",
    id: "6h4f0Fq4di449j06qjBt3O",
    images: [], 
    name: "Apollo EP",
    release_date: "2022-10-14",
    release_date_precision: "day",
    total_tracks: 4,
    type: "album",
    uri: "spotify:album:6h4f0Fq4di449j06qjBt3O"
  },
  {
    album_group: "single",
    album_type: "single",
    artists: [
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/1lJhME1ZpzsEa5M0wW6Mso"
        },
        href: "https://api.spotify.com/v1/artists/1lJhME1ZpzsEa5M0wW6Mso",
        id: "1lJhME1ZpzsEa5M0wW6Mso",
        name: "Charlotte de Witte",
        type: "artist",
        uri: "spotify:artist:1lJhME1ZpzsEa5M0wW6Mso"
      }
    ],
    available_markets: [], 
    external_urls: {
      spotify: "https://open.spotify.com/album/4hLx8gxka0a3rYc2sBN3fQ"
    },
    href: "https://api.spotify.com/v1/albums/4hLx8gxka0a3rYc2sBN3fQ",
    id: "4hLx8gxka0a3rYc2sBN3fQ",
    images: [], 
    name: "Universal Consciousness EP",
    release_date: "2022-04-27",
    release_date_precision: "day",
    total_tracks: 4,
    type: "album",
    uri: "spotify:album:4hLx8gxka0a3rYc2sBN3fQ"
  },
];

export default mockAlbumData;
