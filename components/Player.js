import React, { useState } from 'react';
import Image from 'next/image';
import useSpotify from '@/hooks/useSpotify';
import { useSession } from 'next-auth/react';
// import state management recoil
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayState } from '@/atoms/songAtom';

function Player() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [currentrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const [volume, setVolume] = useState(50);

  return (
    <div>
      <div>
        <Image
          className="rounded-full w-10 h-10"
          src={session?.user.image || noUserImage}
          alt="user"
          width={100}
          height={100}
          priority
        />
      </div>
      <h1 className="text-white">I am a player</h1>
    </div>
  );
}

export default Player;
