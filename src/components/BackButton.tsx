import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="fixed top-4 left-4 z-40 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors md:hidden"
      aria-label="Go back"
    >
      <ChevronLeft className="w-6 h-6 text-accent" />
    </button>
  );
}