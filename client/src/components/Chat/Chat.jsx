import { Paper, TextInput } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Message } from '../Message/Message';
import useStyles from './Chat.styles';
import { ChatHeader } from './ChatHeader';

import axiosInstance from '../../axios';
import { MESSAGES_ENDPOINT, USERS_ENDPOINT } from '../../utils/constants';

// import "./Chat.css";

export const Chat = ({ chat, socket, onlineFriends }) => {
  const { classes } = useStyles();
  const scrollRef = useRef();
  const userGlobalData = useSelector((store) => store.user);

  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [socketMessage, setSocketMessage] = useState(null);

  // get user to put it on chatHeader
  const userID = chat.users.find((u) => u !== userGlobalData?._id);

  const getUser = async () => {
    const { data } = await axiosInstance.get(`${USERS_ENDPOINT}?userID=${userID}`);
    setUser(data);
  };

  // check if user is in onlineFriends
  // to show online statue in chatHeader
  useEffect(() => {
    setIsOnline(onlineFriends.includes(userID));

    socket.on('getMessage', ({ from, text }) => {
      setSocketMessage({ chatID: chat._id, from, text });
      // setMessages((prev) => [...prev, { chatID: chat._id, from, text }]);
      console.log('socket message filled');
    });

    return () => socket.off('getMessage');
  }, []);

  useEffect(() => {
    setMessages((prev) => [...prev, socketMessage]);
  }, [socketMessage]);

  // get all messages of current chat
  const getMessages = async () => {
    try {
      const res = await axiosInstance.get(`${MESSAGES_ENDPOINT}/${chat?._id}`);
      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUser();
    getMessages();
  }, [chat]);

  // scroll to bottom of the chat
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // get message from socket
  // useEffect(() => {
  //   socket.on('getMessage', ({ from, text }) => {
  //     // setSocketMessage({ chatID: chat._id, from, text });
  //     setMessages((prev) => [...prev, { chatID: chat._id, from, text }]);
  //     console.log('socket message filled');
  //   });

  //   return () => socket.off('getMessage');
  // });

  // useEffect(() => {
  //   socketMessage && setMessages((prev) => [...prev, socketMessage]);
  // }, [socketMessage]);

  // when user click 'Enter' to send a message
  const handleSendMessage = async () => {
    const newMsg = {
      chatID: chat?._id,
      from: userGlobalData?._id,
      text: newMessage,
    };

    const { data } = await axiosInstance.post(`${MESSAGES_ENDPOINT}/new`, newMsg);

    socket.emit('sendMessage', {
      from: userGlobalData?._id,
      to: user._id,
      text: newMessage,
    });
    setMessages((prev) => [...prev, data]);
    setNewMessage('');
  };

  return (
    <Paper withBorder>
      <div className={classes.mainContainer}>
        <ChatHeader user={user} isOnline={isOnline} />

        <div className={classes.messagesBox}>
          {messages?.map((item) => (
            <div ref={scrollRef} key={item?._id}>
              <Message own={item?.from === userGlobalData?._id} user={user} message={item} />
            </div>
          ))}
        </div>

        <div className={classes.inputBox}>
          <TextInput
            placeholder="Enter your message..."
            style={{
              flex: 1,
              marginRight: '7px',
            }}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
        </div>
      </div>
    </Paper>
  );
};
