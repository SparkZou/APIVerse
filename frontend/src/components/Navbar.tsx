import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { LogoIcon } from './Logo';

const ScrambleText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
  const intervalRef = useRef<any>(null);

  const startScramble = () => {
    setIsHovering(true);
    let iteration = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(prev => 
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
      }

      iteration += 1 / 3;
    }, 30);
  };

  const stopScramble = () => {
    setIsHovering(false);
    clearInterval(intervalRef.current);
    setDisplayText(text);
  };

  return (
    <span 
      onMouseEnter={startScramble} 
      onMouseLeave={stopScramble}
      className="font-mono font-bold text-xl tracking-wider cursor-pointer"
    >
      {displayText}
    </span>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isLoggedIn = !!localStorage.getItem('token');

  const handleScroll = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <LogoIcon />
              <div className="flex flex-col">
                <ScrambleText text="APIVERSE" />
              </div>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="/#home" onClick={(e) => handleScroll(e, 'home')} className="hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">Home</a>
              <a href="/#pricing" onClick={(e) => handleScroll(e, 'pricing')} className="hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">Pricing</a>
              
              {isLoggedIn ? (
                <Link to="/dashboard" className="hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Dashboard</Link>
              ) : (
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">Get Started</Link>
              )}
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800">
            <a href="/#home" onClick={(e) => handleScroll(e, 'home')} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700">Home</a>
            <a href="/#pricing" onClick={(e) => handleScroll(e, 'pricing')} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700">Pricing</a>
            {isLoggedIn ? (
              <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700">Dashboard</Link>
            ) : (
              <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 hover:bg-blue-700">Get Started</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
