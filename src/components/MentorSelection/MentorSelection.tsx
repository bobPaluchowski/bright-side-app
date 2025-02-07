import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Star, Calendar, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Mentor {
  id: number | string;
  name: string;
  expertise: string;
  availability: boolean;
  rating: number;
  profile_image?: string | null;
}

// Mock data for testing
const mockMentors = [
  {
    id: 1,
    name: "John Doe",
    expertise: "Addictions",
    availability: true,
    rating: 4.8
  },
  {
    id: 2,
    name: "Jane Smith",
    expertise: "Mental health",
    availability: true,
    rating: 4.9
  },
  {
    id: 3,
    name: "David Wilson",
    expertise: "Depression & Anxiety",
    availability: true,
    rating: 4.7
  },
  {
    id: 4,
    name: "Sarah Johnson",
    expertise: "Trauma Recovery",
    availability: true,
    rating: 4.9
  }
];

export default function MentorSelection() {
  const { user } = useAuth();
  const [mentors] = useState<Mentor[]>(mockMentors);
  const [selectedMentor, setSelectedMentor] = useState<number | string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMentorSelect = async (mentorId: number | string) => {
    if (!user) return;

    try {
      // Simulating API call
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSelectedMentor(mentorId);
      toast.success('Mentor assigned successfully');
    } catch (error) {
      toast.error('Error assigning mentor');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 font-quicksand">Choose Your Mentor</h1>
        <p className="text-gray-600 mb-8">
          Select a mentor who will guide you through your recovery journey with understanding and support
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className={`bg-white rounded-xl p-6 shadow-sm cursor-pointer transition-all ${
                selectedMentor === mentor.id
                  ? 'ring-2 ring-accent'
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleMentorSelect(mentor.id)}
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                  {mentor.profile_image ? (
                    <img
                      src={mentor.profile_image}
                      alt={mentor.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{mentor.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{mentor.expertise}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                      {mentor.rating} rating
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {mentor.availability ? 'Available' : 'Unavailable'}
                    </div>
                  </div>
                </div>

                {selectedMentor === mentor.id && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}