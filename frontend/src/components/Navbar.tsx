import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { LogoIcon } from './Logo';

const ScrambleText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startScramble = () => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() => 
        text
          .split("")
          .map((_, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      iteration += 1 / 3;
    }, 30);
  };

  const stopScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
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
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');

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
              <Link to="/" className="hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">Home</Link>
              <Link to="/pricing" className="hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">Pricing</Link>
              
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
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700">Home</Link>
            <Link to="/pricing" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700">Pricing</Link>
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
