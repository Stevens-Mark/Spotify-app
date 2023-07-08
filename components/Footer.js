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
    <>
      {/* group one */}
      <div className="pt-20 px-8 flex justify-none md:justify-between flex-wrap flex-col mdlg:flex-row">
        <div className="flex flex-wrap isSm:flex-nowrap ">
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
              width={100}
              height={100}
            />
          </Link>

          <Link href="#" onClick={disableLinkClick}>
            <Image
              className="h-10 w-10 p-3 bg-gray-800 rounded-full hover:bg-gray-700"
              src={twitterIcon}
              alt="Follow us on Twitter"
              style={{ fill: 'white' }}
            />
          </Link>

          <Link href="#" onClick={disableLinkClick}>
            <Image
              className="h-10 w-10 p-3 bg-gray-800 rounded-full hover:bg-gray-700"
              src={facebookIcon}
              alt="Follow us on facebook"
              width={100}
              height={100}
            />
          </Link>
        </div>
      </div>
      <hr className="border-t-[0.1px] border-gray-900 mx-0 xs:mx-8 mb-8" />
      {/* Final dummy links */}
      <div className="px-8 mb-24 flex justify-between flex-col md:flex-row">
        <span className="flex flex-wrap flex-col isMdLg:flex-row">
          <p className="pr-8 text-pink-swan">Legal</p>
          <p className="pr-8 text-pink-swan">Privacy Policy</p>
          <p className="pr-8 text-pink-swan">Cooke Settings</p>
          <p className="pr-8 text-pink-swan">About Ads</p>
          <p className="text-small text-pink-swan">Accessibility</p>
        </span>
        <p className="text-pink-swan whitespace-nowrap">© 2023 Mark Stevens</p>
      </div>
    </>
  );
}

export default Footer;
