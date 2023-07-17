

<p align="center">
  <img src="/public/spotifyScreenshot.png" />
</p>

# PROJECT PERSONAL *(English)*



# SPOTIFY - A Spotify Clone

This app acts as a playback "controller" using the Spotify Web API that enables the application to interact with Spotify's streaming service,(retrieving search content metadata & controlling playback).

## Objective
It started off as a simple project to learn the basics of Next.js, Tailwind and Recoil (all that I had never used) from a simple tutorial online. There were some issues with the implementation (the author said that there was an issue with the Spotify web api, which actually is not the case - but still aside of that he's made an amazing tutorial. You can watch his video [Here](https://www.youtube.com/watch?v=3xrko3GpYoU) ). Frustrated with the basic featues, I decided to turn it into a more robust project. I signed up with Spotify & got a FREE introductory PREMIUM account for 3 months in order to be able to implement the features. Thus now I had a deadline by which time I must have completed the project. Cool like a real contract!! Game on! Each time I solved one problem, another arrived & I just kept adding more & more pages/components/features. The logic to make all the different components work together in relation to when to start/pause a track (thus showing the correct icon) I found slightly complicated to say the least. I think I improved some features though. For example (at the time of wrting this) with my app, on the shows page, you can use the player controls to navigate between the different episodes, but on spotify, using the player controls navigates away from show episodes & plays a track from elsewhere that I think makes no sense. The same problem occurs with the songs page and the "songs window" on the all search results page. Again, if you select a track & then try to navigate using the player controls (like you can on a playlist, album or artist page) Spotify plays a totally different track from elsewhere. From a user point of view there's no continuity. My app does not have these issues, but it's far from perfect. Spotify is an amazing site, which is so feature rich. Far more than you realise until you try to clone it. If you want a challenge of logic (to keep you awake at night) I strongly advice trying to replicate the site (well at least a apart of it).
...
## Tools
At the time of writing there has been a lot of hype about [chatGPT](https://chat.openai.com/) so I thought let's try it out. The version I found available was 3.5 & not the now famous version 4. It's been interesting... It definately allowed me to be more productive. It gave me ideas very quickly that I would never have thought of or would have taken a lot longer to find using my normal go to for answers [Stackoverflow](https://stackoverflow.com/) . But you need to be careful. it makes stuff up sometimes & you have to learn how to pose your questinons to get more meaningful responses. If you're not careful, it'll waste your time & for complex problems (which was the case most the time with this project) it is useless. At the end of the day you still have to do the coding yourself & ensure things work how you want. But hey it was an experiment. And finally,  I used Tailwind for the first time & I loved it!!!
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

- You will need an account with [Spotify](https://open.spotify.com/) 
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


<p align="center">
  <img src="/public/spotifyScreenshot.png" />
</p>

# PROJET PERSONNEL *(français)*



# SPOTIFY - Un clone de Spotify

Cette application agit comme un "contrôleur" de lecture en utilisant l'API Web de Spotify qui permet à l'application d'interagir avec le service de streaming de Spotify, (récupération des métadonnées du contenu de recherche et contrôle de la lecture).

## Objectif
Cela a commencé comme un simple projet pour apprendre les bases de Next.js, Tailwind et Recoil (que je n'avais jamais utilisé) à partir d'un simple tutoriel en ligne. Il y a eu quelques problèmes avec l'implémentation (l'auteur a dit qu'il y avait un problème avec l'api web de Spotify, ce qui n'est pas le cas), mais à part ça, il a fait un excellent tutoriel. Vous pouvez regarder sa vidéo [Ici](https://www.youtube.com/watch?v=3xrko3GpYoU) ). Frustré par les fonctionnalités de base, j'ai décidé d'en faire un projet plus robuste. Je me suis inscrit chez Spotify et j'ai obtenu un compte PREMIUM d'introduction GRATUIT pour 3 mois afin de pouvoir mettre en place les fonctionnalités. J'avais donc une date limite à laquelle je devais avoir terminé le projet. Cool comme un vrai contrat ! C'est parti ! Chaque fois que je résolvais un problème, un autre arrivait et je continuais à ajouter de plus en plus de pages/composants/fonctionnalités. La logique pour faire fonctionner ensemble tous les différents composants en relation avec le moment de démarrer/pause une piste (affichant ainsi l'icône correcte) m'a semblé un peu compliquée, c'est le moins que l'on puisse dire. Je pense avoir amélioré certaines fonctionnalités. Par exemple (au moment où j'écris ces lignes) avec mon application, sur la page des émissions, vous pouvez utiliser les commandes du lecteur pour naviguer entre les différents épisodes, mais sur Spotify, l'utilisation des commandes du lecteur permet de naviguer en dehors des épisodes et de jouer une piste d'ailleurs, ce qui n'a aucun sens. 



Le même problème se produit avec la page des chansons et la "fenêtre des chansons" sur la page de tous les résultats de recherche. Encore une fois, si vous sélectionnez un titre et que vous essayez ensuite de naviguer en utilisant les commandes du lecteur (comme vous pouvez le faire sur une page de liste de lecture, d'album ou d'artiste), Spotify joue un titre totalement différent de ce qui se trouve ailleurs. Du point de vue de l'utilisateur, il n'y a pas de continuité. Mon application n'a pas ces problèmes, mais elle est loin d'être parfaite. Spotify est un site extraordinaire, très riche en fonctionnalités. Bien plus que vous ne le réalisez jusqu'à ce que vous essayiez de le cloner. Si vous voulez un défi de logique (pour vous tenir éveillé la nuit), je vous conseille vivement d'essayer de reproduire le site (ou du moins une partie).

## Outils
Au moment où j'écris ces lignes, [chatGPT](https://chat.openai.com/) fait l'objet d'un grand battage médiatique, alors je me suis dit qu'il fallait l'essayer. La version que j'ai trouvée disponible était la 3.5 et non la désormais célèbre version 4. C'est intéressant... Il m'a définitivement permis d'être plus productif. Il m'a donné très rapidement des idées auxquelles je n'aurais jamais pensé ou que j'aurais mis beaucoup plus de temps à trouver en utilisant mon site habituel [Stackoverflow] (https://stackoverflow.com/). Mais il faut être prudent. Il invente parfois des choses et il faut apprendre à poser ses questions pour obtenir des réponses plus significatives. Si vous ne faites pas attention, vous perdrez votre temps et pour des problèmes complexes (ce qui était le cas la plupart du temps avec ce projet), c'est inutile. En fin de compte, vous devez toujours coder vous-même et vous assurer que les choses fonctionnent comme vous le souhaitez. Mais bon, c'était une expérience. Enfin, j'ai utilisé Tailwind pour la première fois et j'ai adoré !

## Fonctionnalités
- [x] Interagir avec le service de streaming de Spotify
- [x] Connexion sécurisée avec Next/auth
- [x] Page d'accueil
- [x] Barre latérale contenant toutes les listes de lecture des utilisateurs
- [x] L'option de recherche renvoie les résultats pour les albums, les artistes, les listes de lecture, les podcasts/spectacles et les épisodes.
- [x] Commandes du lecteur multimédia
- [x] Bannière de contrôle du démarrage de la lecture rapide et de la mise en pause lors du défilement de la page
- [x] Animation graphique de l'égaliseur lors de la lecture d'une piste
- [x] Défilement infini des données multimédias
- [x] Utilisation de crochets et de crochets personnalisés
- [x] La liste de recherche actuelle est conservée dans le stockage local pour faciliter les démonstrations.
- [x] Mise en page réactive
- [x] Gestion des états avec [Recoil](https://recoiljs.org/)
- [x] Couleur de fond de la bannière adaptative basée sur les couleurs de l'image
- [x] Api Web avec l'aimable autorisation de [Spotify for developer](https://developer.spotify.com/) Spotify Web API Node
- [x] Spotify Web API Node avec l'aimable autorisation de [Michael Thelin](https://github.com/thelinmichael/spotify-web-api-node)

## Limites / Domaines d'amélioration
- [x] Le site spotify est (faussement) énorme, avec beaucoup de fonctionnalités et de caractéristiques. Je n'ai pas essayé de reproduire l'ensemble du site.
- Vous ne pouvez pas ajouter/supprimer/modifier vos listes de lecture à partir de cette application (peut-être à l'avenir).
- [x] L'épisode ("up next") n'est pas implémenté sur la page de l'émission.
- [x] Les algorithmes utilisés par Spotify pour créer les différentes listes ne sont pas disponibles, donc je ne peux pas créer des listes comme "suggestions", "jump back in" ou "mixes for...." etc.
- [x] Les recherches récentes ont été créées par moi et sont stockées en local. Il faut que j'implémente la fonction "récemment écouté" de Spotify à la place...
- [x] Il y a actuellement quelques problèmes connus avec mon implémentation, listés ci-dessous :

## Problèmes connus
- [x] L'implémentation des boutons de navigation avant et arrière n'est pas parfaite.
- [x] Sur la page Tous les résultats de recherche : si un artiste a été sélectionné et est en cours de lecture, l'icône de pause disparaît lorsque l'utilisateur appuie en avant ou en arrière sur les commandes du lecteur (ce qui n'est pas très évident).
- [x] Si la piste sélectionnée apparaît à la même position (index dans la liste des pistes) dans un autre album/liste de lecture, elle est également surlignée en vert (ce qui ne devrait pas être le cas puisqu'elle se trouve dans un autre album/liste de lecture).
- [x] Si un épisode est en cours de lecture, "getMyCurrentPlayingTrack" ne renvoie aucune information sur la piste (seulement qu'un épisode est en cours de lecture), donc lors du rechargement de la page, aucune information sur la piste n'est affichée dans le coin inférieur gauche. Pour une piste "normale", cela fonctionne. Problème de réponse de Spotify ?
- [x] Aucun des problèmes ci-dessous n'est rédhibitoire car il est peu probable que l'utilisateur rafraîchisse la page soudainement. Dans Spotify, si vous rafraîchissez la page, tout s'arrête, donc ce ne sont pas des fonctionnalités implémentées par Spotify de toute façon.
- [x] La bannière Quickplay perd l'état "icône de pause" (bien qu'un titre soit en cours de lecture) lorsque l'utilisateur rafraîchit/recharge la page (cela se produit pour un épisode ou un artiste).
- [x] Sur la page d'un spectacle : Si un épisode a été sélectionné et est en cours de lecture, la surbrillance verte, qui indique la piste en cours de lecture, disparaît si l'utilisateur actualise/recharge la page.
- [x] Il y a probablement d'autres problèmes que je n'ai pas encore détectés.

# Installation *(français)*

- Vous aurez besoin d'un compte sur [Spotify] (https://open.spotify.com/) 
- VEUILLEZ NOTER : VOUS AUREZ BESOIN D'UN COMPTE PREMIUM POUR ACCÉDER À TOUTES LES FONCTIONNALITÉS
## Prérequis
- NodeJS](https://nodejs.org/en/) Version 16.13.0 
- NPM](https://www.npmjs.com/package/npm) Version 7.6.0
- Visual Studio Code](https://code.visualstudio.com/) ou un autre IDE de votre choix

## Dépendances
- Heroicons](https://heroicons.com/) Version 2.0.17
- GetPixels](https://www.npmjs.com/package/get-pixels) Version 3.3.3
- Lodash](https://lodash.com/) Version 4.17.21
- Toastify](https://www.npmjs.com/package/react-toastify) Version 9.1.3
- Recoil](https://recoiljs.org/) Version 0.7.7
- Rgbaster](https://www.npmjs.com/package/rgbaster) Version 2.1.1
- Spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node) Version 5.0.2
- Tailwind](https://tailwindcss.com/) Version 3.3.1
- [Tailwind-scrollbar-hide](https://www.npmjs.com/package/tailwind-scrollbar-hide) Version 1.1.7

## Installer et exécuter le projet
- Clonez le dépôt sur votre ordinateur :
  `https://github.com/Stevens-Mark/Spotify-app.git`

- A l'intérieur de ce dépôt, installez les paquets/dépendances :
 `npm install`

- Créez un compte avec [Spotify-for-developers] (https://developer.spotify.com/) 
- Créez une application (le nom et la description vous appartiennent)

<p align="center">
  <img src="/public/spotifyForDevelopers.png" />
</p>

- Créez un `.env.local` et ajoutez les informations ci-dessous (avec vos détails)

-NEXTAUTH_URL=http://localhost:3000
-NEXT_PUBLIC_CLIENT_SECRET=votre-secret-client
-NEXT_PUBLIC_CLIENT_ID=votre-id-client
-JWT_SECRET=votre propre mot-secret-jwt-pour-le-cryptage

- Lancer le serveur de développement :

``bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

- Ouvrez [http://localhost:3000](http://localhost:3000) avec votre navigateur pour voir le résultat.

- Assurez-vous de vous être connecté à votre compte Spotify et d'avoir au moins démarré le lecteur une fois. Cela permet de s'assurer que l'application est correctement connectée, afin que l'application puisse contrôler le service de streaming.

## Notes
- C'est un projet sur lequel j'aimerais revenir dans le futur afin d'ajouter encore plus de fonctionnalités ( je pense qu'on pourrait faire ce projet pour toujours)...