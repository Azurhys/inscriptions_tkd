// useMembres.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useMembres = () => {
  const [membres, setMembres] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API}membres.json`)
      .then(response => {
        const data = response.data;
        const membresArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setMembres(membresArray);
      })
      .catch(error => {
        console.error('Error fetching membres data:', error);
      });
  }, []); // Empty dependency array to fetch data only once

  return { membres, setMembres };
};

export default useMembres;
