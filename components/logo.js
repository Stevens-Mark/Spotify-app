import React from 'react';
import Image from 'next/image';

/**
 * Renders the Musicontrol Logo
 * @function Logo
 * @returns {JSX}
 */
function Logo() {
  return (
    <div className="flex items-center mb-10">
      <Image
        className="w-14 h-14 sm:w-20 sm:h-20"
        src="/images/mylogo.png"
        alt=""
        width={100}
        height={100}
        priority
      />
      <Image
        className="w-48 sm:w-96 bg-green-500"
        src="/images/Musicontrol.svg"
        alt=""
        width={100}
        height={100}
        priority
      />
    </div>
  );
}

export default Logo;
