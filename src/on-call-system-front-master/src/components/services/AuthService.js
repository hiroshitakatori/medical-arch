import { useNavigate   } from 'react-router-dom';
import React, { useEffect } from 'react';

export function YourComponent() {
  const navigate = useNavigate();

  const checkAutoLogin = () => {
    const tokenDetailsString = localStorage.getItem('token');
  
    if (!tokenDetailsString || tokenDetailsString === '') {
      console.log({ tokenDetailsString });
        //ret navigate('/login');
    }
    // ...
  };

  // Call checkAutoLogin when the component mounts
  useEffect(() => {
    checkAutoLogin();
  }, []);

 
}
