// useAvailableTimes.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const useAvailableTimes = (selectedWorker, selectedService, selectedDate, user) => {
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      try {
        if (selectedWorker && selectedService && selectedDate && user) {
          console.log(selectedWorker._id)
          console.log(selectedService._id)
          const response = await axios.get(`http://localhost:8800/api/reservation/${selectedWorker._id}/${selectedDate}`, {
            params: { selectedService, user } // Proslijedi user kao parametar
          });
          console.log("Response data:", response.data);
          setAvailableTimes(response.data.availableTimes);
        }
      } catch (error) {
        console.error("Error fetching available times:", error);
      }
    };

    fetchAvailableTimes();
  }, [selectedWorker, selectedService, selectedDate]);

  return availableTimes;
};

export default useAvailableTimes;
