import React from 'react';
import Sidebar from './Sidebar';
import Player from './Player';

const Layout = ({ children }) => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar />
        {children}
      </main>

      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
};

export default Layout;
