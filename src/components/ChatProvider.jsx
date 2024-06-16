// src/components/ChatProvider.jsx
import React, { useEffect } from 'react';
import { Chat } from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';
import client from '../stream';

const ChatProvider = ({ user, token, children }) => {
  useEffect(() => {
    if (user && token) {
      client.connectUser(
        {
          id: user.id,
          name: user.name,
          image: user.image, // optional
        },
        token,
      );
    }

    return () => {
      if (client.userID) {
        client.disconnectUser();
      }
    };
  }, [user, token]);

  if (!user || !token) {
    return <div>Loading...</div>;
  }

  return <Chat client={client}>{children}</Chat>;
};

export default ChatProvider;
