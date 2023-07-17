

<p align="center">
  <img src="/public/spotifyScreenshot.png" />
</p>

# PROJECT PERSONAL *(English)*



# SPOTIFY - A Spotify Clone

This app acts as a playback "controller" using the Spotify Web API that enables the application to interact with Spotify's streaming service,(retrieving search content metadata & controlling playback).

## Objective
What started off as a simple project to learn the basics of Next.js, Tailwind and Recoil (all that I had never used) from a simple tutorial online, turned into a more robust project. Each time I solved one problem, another arrived & I just kept adding more & more pages/compononts. The logic to make all the different components work together in relation to when to start/pause a track (thus showing the correct icon) I found slightly complicated to say the least. I think I improved some features though. For example with my app, on the shows page, you can use the player controls to navigate between the different episodes, but on spotify using the player controls navigates away from show episodes & plays a track from elsewhere that I think makes no sense. The same problem occurs with the songs page and the "songs window" on the all search results page. Again, if you select a track & then try to navigate using the player controls (like you can on a playlist, album or artist page) spotify plays a totally different track from elsewhere. From a user point of view there's no continuity. My app does not have these issues, but it's far from perfect. Spotify is an amazing site, which is so feature rich. Far more than you  realise until you try to clone it. If you want a challenge of logic  (to keep you awake at night) I strongly advice trying to replicate the site (well at least a aprt of it).
...

## Features
- [x] Interact with Spotify's streaming service
- [x] Secure Login using Next/auth
- [x] Welcome page
- [x] Sidebar containing all the users playlists
- [x] Search option returns results for albums, artists, playlists, podcasts/shows & episodes
- [x] Media player controls
- [x] Quick play start/pause control banner on page scroll
- [x] Equaliser graphic animation when track playing
- [x] Infinite scrolling of media data
- [x] Use of hooks and custom hooks
- [x] Rccent search list currently persisted in local storage for ease of demo
- [x] Responsive layout
- [x] State Management with [Recoil](https://recoiljs.org/)
- [x] Adaptive banner colour background based on image colors
- [x] Web Api courtesy of [Spotify for developer](https://developer.spotify.com/) Spotify Web API Node
- [x] Spotify Web API Node courtesy of [Michael Thelin](https://github.com/thelinmichael/spotify-web-api-node)

## Limitations / Areas for improvement
- [x] The spotify site is (deceptively) huge, with a lot of functionality & features. I have not attempted to replicate the whole site.
- [x] You cannot add/delete/modify your playlists from this app (maybe in the future).
- [x] Episode ("up next") not implemented on show page.
- [x] The Algorithms used by Spotify to create the various lists are not available, so I cannot create lists like "sugguestions", "jump back in" or "mixes for...." etc
- [x] Recent searches was created by me & are stored in local storage. I need to implement Spotify's recently played feature instead...
- [x] There are a presently a few known issues with my implementation, listed below:

## Known issues
- [x] Implmentation of the forward & backward navigation buttons not perfect.
- [x] On the All search results page: if an artist has been selected & is playing, the "pause icon" disappears when the user presses forward or backwards on the player controls (not so obvious).
- [x] If the selected playing track appears in the same position (index in the track listing) in another album/playlist then it is green highlighted too (which should not be the case as it's in a different album/playlist).
- [x] If an episode is curently playing "getMyCurrentPlayingTrack" does not return any track information (only that an episode is playing) so on page reload no track information is shown in the bottom left hand side corner. For a "normal" track it works. Spotify response issue??
- [x] None of the issues below are "deal breakers" as it's unlikely that the user would just refresh the page suddenly. In Spotify if you refresh the page everything stops playing so these is not features implemented by Spotify anyway.
- [x] Quickplay Banner loses "pause icon" state (although a track is playing) when a user refreshes/reloads the page (this occurs for an episode or an artist).
- [x] On a Show page: If an episode has been selected & is playing, the green highlight, that indicates which track is playing, disappears if the user refreshes/reloads the page.
- [x] There are probably some other issues that I haven't spotted as yet.

# Installation *(English)*

- You will need an account with  [Spotify](https://open.spotify.com/) 
- PLEASE NOTE: YOU WILL NEED A PREMIUM ACCOUNT TO ACCESS ALL THE FEATURES
## Prerequisites
- [NodeJS](https://nodejs.org/en/)  Version 16.13.0 
- [NPM](https://www.npmjs.com/package/npm) Version 7.6.0
- [Visual Studio Code](https://code.visualstudio.com/) or another IDE of your choice

## Dependencies
- [Heroicons](https://heroicons.com/) Version 2.0.17
- [GetPixels](https://www.npmjs.com/package/get-pixels) Version 3.3.3
- [Lodash](https://lodash.com/) Version 4.17.21
- [Toastify](https://www.npmjs.com/package/react-toastify) Version 9.1.3
- [Recoil](https://recoiljs.org/) Version 0.7.7
- [Rgbaster](https://www.npmjs.com/package/rgbaster) Version 2.1.1
- [Spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node) Version 5.0.2
- [Tailwind](https://tailwindcss.com/) Version 3.3.1
- [Tailwind-scrollbar-hide](https://www.npmjs.com/package/tailwind-scrollbar-hide) Version 1.1.7


## Installing and running the project
- Clone the repository onto your computer :
  `https://github.com/Stevens-Mark/Spotify-app.git`

- Inside this repository, install the packages/dependencies :
 `npm install`

- Create an account with [Spotify-for-developers](https://developer.spotify.com/) 
- Create an app (what you call it & the description is up to you)

<p align="center">
  <img src="/public/spotifyForDevelopers.png" />
</p>

- Create a `.env.local` and add the information below (with your details)

-NEXTAUTH_URL=http://localhost:3000
-NEXT_PUBLIC_CLIENT_SECRET=your-client-secret
-NEXT_PUBLIC_CLIENT_ID=your-client-id
-JWT_SECRET=your-own-made-up-jwt-secret-word-for-the-encryption


- Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- Make sure you have connected to your Spotify account & at least started the player once. This makes sure that the application is connected properly, in order for the app to control the streaming service.

## Notes
- This is a project that I would like to come back to in the future in order to add yet more features ( I think one could do this project forever)...

