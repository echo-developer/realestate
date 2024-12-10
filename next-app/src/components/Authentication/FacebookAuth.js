import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';

const FacebookAuth = () => {
  const [user, setUser] = useState(null);

  const responseFacebook = (response) => {
    if (response.accessToken) {
      axios.post('/api/auth/facebook', { accessToken: response.accessToken })
        .then((res) => {
          console.log('Facebook Login Success:', res.data);
          setUser(res.data.user);
        })
        .catch((err) => {
          console.error('Facebook Login Error:', err);
        });
    } else {
      console.error('Facebook Login Failed:', response);
    }
  };

  return (
    <div>
      {!user ? (
        <FacebookLogin
          appId="your-facebook-app-id" 
          autoLoad={false}
          fields="name,email,picture"
          callback={responseFacebook}
        />
      ) : (
        <div>Welcome, {user.name}</div>
      )}
    </div>
  );
};

export default FacebookAuth;
