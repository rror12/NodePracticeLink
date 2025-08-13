import React, { useEffect, useState } from "react";
import axios from "axios";
import './login.css';
import './FriendsTab.css';

function FriendsTab() {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sentTo, setSentTo] = useState({});

  // Get the entire API response string from localStorage
  const userResponseString = localStorage.getItem("user");

  // Parse the entire response string into a JavaScript object
  const parsedResponse = userResponseString ? JSON.parse(userResponseString) : null;
  
  // The actual user object is inside the 'user' key of the parsed response
  const currentUser = parsedResponse?.user;

  // console.log("I am currentUser : ", currentUser);
  
  const currentUserId = currentUser?._id;
  // console.log("I am currentUserId : ", currentUserId);

  useEffect(() => {
    if (!currentUserId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        // Fetch friends first
        const friendsRes = await axios.get(`http://localhost:5000/api/users/friends?currentUserId=${currentUserId}`);
        setFriends(Array.isArray(friendsRes.data) ? friendsRes.data : []);

        // Fetch suggestions (people you might know)
        const res = await axios.get(`http://localhost:5000/api/users?currentUserId=${currentUserId}`);
        const allUsers = Array.isArray(res.data) ? res.data : [];

        // Filter out the current user (backend already does, but keep it safe)
        const filteredUsers = allUsers.filter(user => user._id !== currentUserId);
        setUsers(filteredUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [currentUserId]);

  const sendFriendRequest = async (userId, fname, lname) => {
    try {
      await axios.post("http://localhost:5000/api/friend-request", {
        from: currentUserId,
        to: userId
      });
      setSentTo(prev => ({ ...prev, [userId]: true }));
      // alert(`Friend request sent to ${fname} ${lname}`);
    } catch (error) {
      // If already sent, still mark as sent in UI
      if (error?.response?.status === 400 && error?.response?.data?.message === "Already sent") {
        setSentTo(prev => ({ ...prev, [userId]: true }));
        // alert(`Friend request already sent to ${fname} ${lname}`);
      } else {
        console.log(error);
        alert(error.response?.data?.message || "Failed to send request");
      }
    }
  };

  if (loading) return <p>Loading friends...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="header1">
        <img src="/favicon.png" alt="Logo" className="logo" />
        <h2 className="title">Friends Tab</h2>
      </div>
      <div className="friends-tab">
          {/* Your Friends Section */}
          <h3>Your friends</h3>
          {friends.length === 0 ? (
            <p>You have no friends yet.</p>
          ) : (
            <div className="friends-list">
              {friends.map((friend) => (
                <div className="friend-card" key={friend._id}>
                  <div className="friend-info">
                    <p className="friend-name">You and {friend.fname} {friend.lname} are friends now</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* People you might know Section */}
          <h3>People you might know</h3>
          {users.length === 0 ? (
            <p>No other users found.</p>
          ) : (
            <div className="friends-list">
              {users.map((user) => (
                <div className="friend-card" key={user._id}>
                  <div className="friend-info">
                    <p className="friend-name">{user.fname} {user.lname}</p>
                  </div>
                  <button
                    className="send-request-btn"
                    disabled={!!sentTo[user._id]}
                    onClick={() => sendFriendRequest(user._id, user.fname, user.lname)}
                  >
                    {sentTo[user._id] ? 'Request sent' : 'Add Friend'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  );
}

export default FriendsTab;