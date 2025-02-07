import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Calendar, MessageCircle, Video, User, Settings, X, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navigationItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/journal', icon: BookOpen, label: 'Journal' },
  { path: '/appointments', icon: Calendar, label: 'Appointments' },
  { path: '/chat', icon: MessageCircle, label: 'Chat' },
  { path: '/video', icon: Video, label: 'Video' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function MainNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Trigger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 bg-white rounded-full shadow-lg"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-accent" />
          ) : (
            <Menu className="w-6 h-6 text-accent" />
          )}
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
            {user?.client_img ? (
              <img
                src={user.client_img}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <div className="font-semibold font-quicksand">{user?.first_name}</div>
            <div className="text-sm text-gray-500">Welcome back!</div>
          </div>
        </div>

        <div className="space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                location.pathname === item.path
                  ? 'bg-secondary text-accent'
                  : 'hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Navigation - Collapsible Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
      <nav
        className={`md:hidden fixed top-0 left-0 h-screen w-64 bg-white shadow-xl transform transition-transform z-50 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              {user?.client_img ? (
                <img
                  src={user.client_img}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <div className="font-semibold font-quicksand">{user?.first_name}</div>
              <div className="text-sm text-gray-500">Welcome back!</div>
            </div>
          </div>

          <div className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                  location.pathname === item.path
                    ? 'bg-secondary text-accent'
                    : 'hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          {navigationItems.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center space-y-1 ${
                location.pathname === item.path ? 'text-accent' : 'text-gray-500'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}