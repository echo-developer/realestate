import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleAuth = () => {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (response) => {
    const token = response.credential;
    axios.post('/api/auth/google', { token })
      .then((res) => {
        console.log('Google Login Success:', res.data);
        setUser(res.data.user);
      })
      .catch((err) => {
        console.error('Google Login Error:', err);
      });
  };

  const handleLoginFailure = (error) => {
    console.error('Google Login Failed:', error);
  };    

  return (
    <div>
      {!user ? (
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
        />
      ) : (
        <div>Welcome, {user.name}</div>
      )}
    </div>
  );
};

export default GoogleAuth;
