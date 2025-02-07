import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Video as VideoIcon, Mic, MicOff, Video as VideoCamera, VideoOff, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface Mentor {
  id: string;
  full_name: string;
}

export default function Video() {
  const { user } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    const { data, error } = await supabase
      .from('mentors')
      .select('id, full_name');

    if (error) {
      toast.error('Error fetching mentors');
      return;
    }

    setMentors(data || []);
  };

  const handleStartCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled,
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setIsCallActive(true);
      toast.success('Call started successfully');
    } catch (error) {
      toast.error('Error accessing media devices');
    }
  };

  const handleEndCall = () => {
    if (localVideoRef.current?.srcObject) {
      const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    
    setIsCallActive(false);
    toast.success('Call ended');
  };

  const toggleAudio = () => {
    if (localVideoRef.current?.srcObject) {
      const audioTrack = (localVideoRef.current.srcObject as MediaStream)
        .getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const videoTrack = (localVideoRef.current.srcObject as MediaStream)
        .getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 font-quicksand">Video Call</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Video Preview */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            {isCallActive ? (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full ${
                    isAudioEnabled ? 'bg-gray-200' : 'bg-red-500 text-white'
                  }`}
                >
                  {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full ${
                    isVideoEnabled ? 'bg-gray-200' : 'bg-red-500 text-white'
                  }`}
                >
                  {isVideoEnabled ? (
                    <VideoCamera className="w-5 h-5" />
                  ) : (
                    <VideoOff className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={handleEndCall}
                  className="p-3 rounded-full bg-red-500 text-white"
                >
                  <Phone className="w-5 h-5 transform rotate-225" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <select
                  value={selectedMentor?.id || ''}
                  onChange={(e) => {
                    const mentor = mentors.find((m) => m.id === e.target.value);
                    setSelectedMentor(mentor || null);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="">Select a mentor</option>
                  {mentors.map((mentor) => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.full_name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleStartCall}
                  disabled={!selectedMentor}
                  className="w-full bg-accent text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Call
                </button>
              </div>
            )}
          </div>

          {/* Remote Video */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            {selectedMentor && (
              <div className="mt-4 text-center">
                <h3 className="font-semibold">{selectedMentor.full_name}</h3>
                <p className="text-sm text-gray-500">Mentor</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
              <VideoIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold font-quicksand">Video Call Tips</h2>
              <p className="text-gray-600 mt-1">
                Ensure you have a stable internet connection and a quiet environment
                for the best experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}