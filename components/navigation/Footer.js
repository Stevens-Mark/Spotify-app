import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import instagramIcon from '@/public/images/instagramWhite.svg';
import twitterIcon from '@/public/images/twitterWhite.svg';
import facebookIcon from '@/public/images/facebookWhite.svg';

/**
 * Reners the general link information at the bottom of each page
 * @function Footer
 * @returns {JSX}
 */
function Footer() {
  const disableLinkClick = (e) => {
    e.preventDefault();
    // the links are disabled for now
  };

  return (
    <nav role="navigation" aria-label="Outside Links Menu">
      {/* group one */}
      <div className="pt-20 px-8 flex justify-none md:justify-between flex-wrap flex-col mdlg:flex-row">
        <div className="flex flex-wrap isSm:flex-nowrap">
          <ul className="space-y-4 w-48 mdlg:w-56 mb-10">
            <li>
              <p className="text-white">Company</p>
            </li>

            <li>
              <Link
                href="#"
                onClick={disableLinkClick}
                className="text-pink-swan hover:text-white"
              >
                <p>About</p>
              </Link>
            </li>

            <li>
              <Link
                href="#"
                onClick={disableLinkClick}
                className="text-pink-swan hover:text-white"
              >
                <p>Jobs</p>
              </Link>
            </li>

            <li>
              <Link
                href="#"
                onClick={disableLinkClick}
                className="text-pink-swan hover:text-white"
              >
                <p>For the Record</p>
              </Link>
            </li>
          </ul>

          {/* group two */}

          <ul className="space-y-4 w-48 mdlg:w-56 mb-10">
            <li>
              <p className="space-x-2 text-white">Communities</p>
            </li>

            <li>
              <Link
                href="#"
                onClick={disableLinkClick}
                className=" space-x-2 text-pink-swan hover:text-white"
              >
                <p>For Artists</p>
              </Link>
            </li>

            <li>
              <Link
                href="#"
                onClick={disableLinkClick}
                className="space-x-2 text-pink-swan hover:text-white"
              >
                <p>Developers</p>
              </Link>
            </li>

            <li>
              <Link
                href="#"
                onClick={disableLinkClick}
                className=" space-x-2 text-pink-swan hover:text-white"
              >
                <p>Advertising</p>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                onClick={disableLinkClick}
                className=" space-x-2 text-pink-swan hover:text-white"
              >
                <p>Investors</p>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                onClick={disableLinkClick}
                className=" space-x-2 text-pink-swan hover:text-white"
              >
                <p>Vendors</p>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                onClick={disableLinkClick}
                className=" space-x-2 text-pink-swan hover:text-white"
              >
                <p>Spotify for work</p>
              </Link>
            </li>
          </ul>

          {/* group three */}

          <ul className="space-y-4 mb-10">
            <li>
              <p className="text-white">Useful links</p>
            </li>

            <li>
              <Link
                href="#"
                onClick={disableLinkClick}
                className="text-pink-swan hover:text-white"
              >
                <p>Support</p>
              </Link>
            </li>

            <li>
              <Link
                href="#"
                onClick={disableLinkClick}
                className="text-pink-swan hover:text-white"
              >
                <p>Free Mobile App</p>
              </Link>
            </li>
          </ul>
        </div>

        {/* group four - social media */}

        <div className="flex space-x-4 xxs:justify-end mb-10">
          <Link href="#" onClick={disableLinkClick}>
            <Image
              className="h-10 w-10 p-2 bg-gray-800 rounded-full hover:bg-gray-700 min-w-12"
              src={instagramIcon}
              alt="Check us out on Instagram"
            />
          </Link>

          <Link href="#" onClick={disableLinkClick}>
            <Image
              className="h-10 w-10 p-3 bg-gray-800 rounded-full hover:bg-gray-700"
              src={twitterIcon}
              alt="Follow us on Twitter"
            />
          </Link>

          <Link href="#" onClick={disableLinkClick}>
            <Image
              className="h-10 w-10 p-3 bg-gray-800 rounded-full hover:bg-gray-700"
              src={facebookIcon}
              alt="Follow us on facebook"
            />
          </Link>
        </div>
      </div>
      <hr className="border-t-[0.1px] border-gray-900 mx-0 xs:mx-8 mb-8" />
      {/* Final dummy links */}
      <div className="px-8 flex justify-between flex-col md:flex-row">
        <span className="flex flex-wrap flex-col isMdLg:flex-row">
          <p className="pr-8 text-pink-swan hover:text-white cursor-pointer">
            Legal
          </p>
          <p className="pr-8 text-pink-swan hover:text-white cursor-pointer">
            Privacy Policy
          </p>
          <p className="pr-8 text-pink-swan hover:text-white cursor-pointer">
            Cooke Settings
          </p>
          <p className="pr-8 text-pink-swan hover:text-white cursor-pointer">
            About Ads
          </p>
          <p className="text-small text-pink-swan hover:text-white cursor-pointer">
            Accessibility
          </p>
        </span>

        <Link
          href="https://stevensmarkportfolio.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="text-white whitespace-nowrap hover:underline">
            © 2023 Mark Stevens
          </p>
        </Link>
      </div>
      <hr className="border-t-[0.1px] border-gray-900 mx-0 xs:mx-8 mt-8 mb-28" />
    </nav>
  );
}

export default Footer;
