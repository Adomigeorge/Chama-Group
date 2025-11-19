import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Invitation = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const acceptInvitation = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Please log in to accept the invitation');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/api/groups/${groupId}/accept`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        
        if (data.status === 'success') {
          setMessage('Invitation accepted successfully! Redirecting to group...');
          setTimeout(() => {
            navigate(`/group/${groupId}`);
          }, 2000);
        } else {
          setMessage(data.message || 'Failed to accept invitation');
        }
      } catch (error) {
        setMessage('Error accepting invitation');
      } finally {
        setIsLoading(false);
      }
    };

    acceptInvitation();
  }, [groupId, navigate]);

  return (
    <div className="invitation-container">
      <div className="invitation-card">
        <h1>Group Invitation</h1>
        {isLoading ? (
          <p>Processing invitation...</p>
        ) : (
          <p>{message}</p>
        )}
      </div>
    </div>
  );
};

export default Invitation;