import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  title: string;
  date_time: string;
  mentor_id: string;
  status: string;
}

interface Mentor {
  id: string;
  full_name: string;
  specializations: string[];
}

export default function Appointments() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    fetchAppointments();
    fetchMentors();
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      toast.error('Error fetching appointments');
      return;
    }

    setAppointments(data || []);
  };

  const fetchMentors = async () => {
    const { data, error } = await supabase
      .from('mentors')
      .select('id, full_name, specializations');

    if (error) {
      toast.error('Error fetching mentors');
      return;
    }

    setMentors(data || []);
  };

  const handleCreateAppointment = async () => {
    if (!user || !selectedMentor || !selectedTime || !title) {
      toast.error('Please fill in all fields');
      return;
    }

    const dateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      parseInt(selectedTime.split(':')[0]),
      parseInt(selectedTime.split(':')[1])
    ).toISOString();

    const { error } = await supabase.from('appointments').insert([
      {
        user_id: user.id,
        mentor_id: selectedMentor,
        title,
        date_time: dateTime,
        status: 'pending',
      },
    ]);

    if (error) {
      toast.error('Error creating appointment');
      return;
    }

    toast.success('Appointment created successfully');
    fetchAppointments();
    setTitle('');
    setSelectedMentor('');
    setSelectedTime('');
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 9; i <= 17; i++) {
      slots.push(`${i.toString().padStart(2, '0')}:00`);
      slots.push(`${i.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const generateWeekDays = () => {
    const days = [];
    const start = startOfWeek(selectedDate);
    for (let i = 0; i < 7; i++) {
      days.push(addDays(start, i));
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 font-quicksand">Appointments</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 font-quicksand">
              Select Date & Time
            </h2>
            
            <div className="grid grid-cols-7 gap-2 mb-6">
              {generateWeekDays().map((date) => (
                <button
                  key={date.toString()}
                  onClick={() => setSelectedDate(date)}
                  className={`p-2 rounded-lg text-center ${
                    isSameDay(date, selectedDate)
                      ? 'bg-accent text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="text-xs mb-1">
                    {format(date, 'EEE')}
                  </div>
                  <div className="font-semibold">
                    {format(date, 'd')}
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {generateTimeSlots().map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-2 rounded-lg text-center text-sm ${
                    selectedTime === time
                      ? 'bg-accent text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Appointment Form */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 font-quicksand">
              Book Appointment
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Appointment Title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Mentor
                </label>
                <select
                  value={selectedMentor}
                  onChange={(e) => setSelectedMentor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="">Choose a mentor</option>
                  {mentors.map((mentor) => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleCreateAppointment}
                className="w-full bg-accent text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors font-semibold"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 font-quicksand">
            Upcoming Appointments
          </h2>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-secondary p-3 rounded-full">
                    <CalendarIcon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{appointment.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {format(new Date(appointment.date_time), 'PPp')}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {mentors.find((m) => m.id === appointment.mentor_id)?.full_name}
                      </div>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                  {appointment.status}
                </span>
              </div>
            ))}
            {appointments.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No upcoming appointments
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}