import React, { useEffect, useState } from "react";
import axios from "axios";
import './NotificationsTab.css';

function NotificationsTab() {
  const [requests, setRequests] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"))?.user;
  // console.log("I am currentUser in NotificationsTab: ", currentUser);
  

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/friend-request/${currentUser._id}`);
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to load requests", err);
      }
    };

    fetchRequests();
  }, [currentUser]);

  const handleAccept = async (fromUserId) => {
    try {
      await axios.post("http://localhost:5000/api/friend-request/accept", {
        from: fromUserId,
        to: currentUser._id
      });
      setRequests(prev => prev.filter(r => r.from._id !== fromUserId));
    } catch (err) {
      alert("Error accepting request");
    }
  };

  return (
    <div>
    <div className="header1">
        <img src="/favicon.png" alt="Logo" className="logo" />
        <h2 className="title">Notifications Tab</h2>
      </div>
    <div className="friend-requests-container">
      <h2>Friend Requests</h2>
      {requests.length === 0 ? (
        <p>No new requests</p>
      ) : (
        requests.map((req) => (
          <div key={req._id} className="notification-card">
            <span>
              {req.from.fname} {req.from.lname} has sent you a friend request
            </span>
            <button onClick={() => handleAccept(req.from._id)}>Accept</button>
          </div>
        ))
      )}
    </div>
    </div>
  );
}

export default NotificationsTab;
