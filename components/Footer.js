import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import instagramIcon from '@/public/images/instagram.svg';

function Footer() {
  return (
    <>
      {/* group one */}
      <nav className="p-8 flex justify-none md:justify-between flex-wrap flex-col mdlg:flex-row">
        <div className="flex flex-wrap isSm:flex-nowrap ">
          <ul className="space-y-4 w-48 mdlg:w-56 mb-10">
            <li>
              <p className="text-white">Company</p>
            </li>

            <li>
              <Link href="#" className="text-pink-swan hover:text-white">
                <p>About</p>
              </Link>
            </li>

            <li>
              <Link href="#" className="text-pink-swan hover:text-white">
                <p>Jobs</p>
              </Link>
            </li>

            <li>
              <Link href="#" className="text-pink-swan hover:text-white">
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
                className=" space-x-2 text-pink-swan hover:text-white"
              >
                <p>For Artists</p>
              </Link>
            </li>

            <li>
              <Link
                href="#"
                className="space-x-2 text-pink-swan hover:text-white"
              >
                <p>Developers</p>
              </Link>
            </li>

            <li>
              <Link
                href="#"
                className=" space-x-2 text-pink-swan hover:text-white"
              >
                <p>Advertising</p>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className=" space-x-2 text-pink-swan hover:text-white"
              >
                <p>Investors</p>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className=" space-x-2 text-pink-swan hover:text-white"
              >
                <p>Vendors</p>
              </Link>
            </li>
            <li>
              <Link
                href="#"
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
              <Link href="#" className="text-pink-swan hover:text-white">
                <p>Support</p>
              </Link>
            </li>

            <li>
              <Link href="#" className="text-pink-swan hover:text-white">
                <p>Free Mobile App</p>
              </Link>
            </li>
          </ul>
        </div>

        {/* group four - social media */}
        <div className="flex space-x-4 xxs:justify-end mb-10">
          <Link href="#">
            <Image
              className="h-12 w-12 p-2 bg-gray-900 rounded-full hover:bg-gray-800 min-w-12"
              src={instagramIcon}
              alt="Follow us on Twitter"
              width={100}
              height={100}
            />
          </Link>

          <Link href="#">
            <Image
              className="h-12 w-12 p-2 bg-gray-900 rounded-full hover:bg-gray-800"
              src={instagramIcon}
              alt="Follow us on Twitter"
              style={{ fill: 'white' }}
            />
          </Link>

          <Link href="#">
            <Image
              className="h-12 w-12 p-2 bg-gray-900 rounded-full hover:bg-gray-800"
              src={instagramIcon}
              alt="Follow us on Twitter"
              width={100}
              height={100}
            />
          </Link>
        </div>
      </nav>
      <hr className="border-t-[0.1px] border-gray-900  mb-24 mx-0 xs:mx-8" />
    </>
  );
}

export default Footer;
