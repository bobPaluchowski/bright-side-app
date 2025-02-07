import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Upload, User, LogOut, Trash2, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('users')
        .update({ client_img: filePath })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success('Profile image updated');
    } catch (error) {
      toast.error('Error updating profile image');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      toast.error('Error updating password');
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('delete_user_account', {
        user_id: user.id
      });

      if (error) throw error;

      await signOut();
      toast.success('Account deleted successfully');
      navigate('/auth');
    } catch (error) {
      toast.error('Error deleting account');
    }
  };

  return (
    <div className="min-h-screen bg-primary p-6">
      <BackButton />
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 font-quicksand">Settings</h1>

        {/* Profile Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-6">Profile</h2>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center">
                {user?.client_img ? (
                  <img
                    src={user.client_img}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer">
                <Upload className="w-4 h-4 text-accent" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
            <div>
              <div className="font-semibold">{user?.email}</div>
              <div className="text-sm text-gray-500">Profile Picture</div>
            </div>
          </div>

          {/* Password Change Form */}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-accent text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Account Management */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          
          <button
            onClick={() => navigate('/mentor-selection')}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100"
          >
            <span className="font-medium">Change Mentor</span>
            <ChevronLeft className="w-5 h-5 transform rotate-180" />
          </button>

          <button
            onClick={() => signOut()}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100"
          >
            <LogOut className="w-5 h-5 text-gray-500" />
            <span>Sign Out</span>
          </button>

          {showDeleteConfirm ? (
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                >
                  Yes, Delete Account
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete Account</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}