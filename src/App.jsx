import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const [seats, setSeats] = useState(Array(80).fill(false)); // false indicates seat availability
  const [seatCount, setSeatCount] = useState(""); // State for input value
  const api = "http://54.196.117.241:8080/api/seats";

  // Fetch seat availability from backend when the component loads
  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        const response = await axios.get(`${api}/status`);
        // Assuming response data is an array of seat objects with "id" and "booked" properties
        const seatStatuses = response.data;
        const updatedSeats = seats.map(
          (seat, index) => seatStatuses[index]?.booked || false
        );
        setSeats(updatedSeats);
      } catch (error) {
        console.error("Error fetching seat data:", error);
      }
    };
    fetchSeatData();
  }, []);

  const handleBooking = (seatIndex) => {
    // const updatedSeats = [...seats];
    // updatedSeats[seatIndex] = !updatedSeats[seatIndex];
    // setSeats(updatedSeats);
  };

  const handleInputChange = (e) => {
    setSeatCount(e.target.value);
  };

  const handleSubmit = async () => {
    if (seatCount < 1 || seatCount > 7) {
      alert("Please enter a number between 1 and 7.");
      return;
    }

    const endPoint = `${api}/book`;
    try {
      const response = await axios.post(endPoint, { numberOfSeats: seatCount });
      console.log(response.data); // Handle response (e.g., update booked seats in UI)

      // Fetch updated seat data after booking
      const updatedResponse = await axios.get(`${api}/status`);
      const updatedSeatStatuses = updatedResponse.data;
      const updatedSeats = seats.map(
        (seat, index) => updatedSeatStatuses[index]?.booked || false
      );
      setSeats(updatedSeats);
    } catch (error) {
      console.error("Error booking seats:", error);
      alert("An error occurred while booking seats. Please try again.");
    }
  };

  const handleResetBookings = async () => {
    const endPoint = `${api}/reset`;

    try {
      const response = await axios.delete(endPoint);

      // Fetch updated seat data after booking
      const updatedResponse = await axios.get(`${api}/status`);
      const updatedSeatStatuses = updatedResponse.data;
      const updatedSeats = seats.map(
        (seat, index) => updatedSeatStatuses[index]?.booked || false
      );
      setSeats(updatedSeats);
    } catch (error) {
      console.error("Error resetting:", error);
      alert("An error occurred while resetting seats. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Train Ticket Booking System 🚆</h2>
      <div className="wrapper">
        <div className="left-window">
          <div className="left-side">
            <span>🟢 : Available Seats</span>
            <span>🔴 : Unavailable Seats</span>
          </div>
          <div className="left-side">
            <h3>Book Seats 💺</h3>
            <input
              type="number"
              placeholder="Enter number of seats"
              min="1"
              max="7"
              value={seatCount}
              onChange={handleInputChange}
            />
            <button onClick={handleSubmit}>Submit 🟢</button>
          </div>
          <div className="left-side-reset">
            <button onClick={handleResetBookings}>Reset Bookings ⛔</button>
          </div>
        </div>

        <div className="right-side">
          <h3>Seat Layout 💺</h3>
          <div className="seat-grid">
            {seats.map((isBooked, index) => (
              <div
                key={index}
                className={`seat ${isBooked ? "booked" : ""}`}
                onClick={() => handleBooking(index)}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
