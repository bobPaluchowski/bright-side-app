import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Calendar, Users, BookOpen, Video, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface UserProfile {
  full_name: string | null;
  onboarding_completed: boolean;
}

const features = [
  { name: 'Journal', icon: BookOpen, path: '/journal', color: 'bg-blue-100' },
  { name: 'Appointments', icon: Calendar, path: '/appointments', color: 'bg-green-100' },
  { name: 'Chat', icon: MessageCircle, path: '/chat', color: 'bg-yellow-100' },
  { name: 'Video Call', icon: Video, path: '/video', color: 'bg-purple-100' },
];

export default function Home() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getTimeBasedGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    };
    setGreeting(getTimeBasedGreeting());
  }, []);

  useEffect(() => {
    const getProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('users')
        .select('full_name, onboarding_completed')
        .eq('id', user.id)
        .single();

      if (error) {
        toast.error('Error fetching profile');
        return;
      }

      setProfile(data);
    };

    getProfile();
  }, [user]);

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-quicksand font-bold text-text mb-2">
            {greeting}, {profile?.full_name || 'Friend'}
          </h1>
          <p className="text-gray-600 font-open-sans">
            Your daily companion for strength and support
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 font-quicksand">Today's Progress</h2>
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">1</div>
                <div className="text-gray-600">Day at a time</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 font-quicksand">Next Appointment</h2>
            <div className="flex items-center justify-center h-40">
              <div className="text-center text-gray-600">
                No upcoming appointments
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature) => (
            <Link
              key={feature.name}
              to={feature.path}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`${feature.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="font-quicksand font-semibold">{feature.name}</h3>
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-secondary bg-opacity-50 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-white p-3 rounded-full">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-quicksand font-semibold mb-2">Connect with a Mentor</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get personalized support from experienced mentors who understand your journey.
              </p>
              <button className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm">
                Find a Mentor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}