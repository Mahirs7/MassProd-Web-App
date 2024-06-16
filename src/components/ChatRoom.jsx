// src/components/ChatRoom.jsx
import React from 'react';
import { Channel, Window, MessageList, MessageInput, ChannelHeader } from 'stream-chat-react';

const ChatRoom = ({ channel }) => {
  return (
    <Channel channel={channel}>
      <Window>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Window>
    </Channel>
  );
};

export default ChatRoom;
