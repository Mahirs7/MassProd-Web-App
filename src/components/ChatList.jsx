// src/components/ChatList.jsx
import React from 'react';
import { ChannelList } from 'stream-chat-react';
import client from '../stream'; // Import the Stream client

const ChatList = () => {
  const filters = { members: { $in: [client.userID] } };
  const sort = { last_message_at: -1 };

  return <ChannelList filters={filters} sort={sort} />;
};

export default ChatList;
