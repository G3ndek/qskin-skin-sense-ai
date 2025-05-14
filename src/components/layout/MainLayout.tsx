
import React from 'react';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-pink-50 dark:bg-qskyn-darkBackground text-gray-700 dark:text-qskyn-darkText transition-colors duration-300">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-10">
        {children}
      </main>
      <footer className="bg-white dark:bg-qskyn-darkCard border-t border-pink-200 dark:border-qskyn-darkBorder py-4 px-6">
        <div className="container mx-auto text-center text-sm text-gray-500 dark:text-qskyn-darkText/70">
          © {new Date().getFullYear()} QSkyn. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
