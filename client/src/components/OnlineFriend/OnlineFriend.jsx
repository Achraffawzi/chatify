import { Avatar, Indicator, Text } from '@mantine/core';
// import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../axios';

import useStyles from './OnlineFriend.styles';

export const OnlineFriend = ({ onlineFriend, setSelectedChat }) => {
  const { classes } = useStyles();
  const [onlineUser, setOnlineUser] = useState(null);
  const [chat, setChat] = useState(null);
  const { _id } = useSelector((store) => store.user.user);

  // get online friend's data

  useEffect(() => {
    const getUser = async (id) => {
      const { data } = await axiosInstance.get(`/api/users?userID=${id}`);
      setOnlineUser(data);
    };
    getUser(onlineFriend);
  }, []);

  // create new chat

  // get chat of current user and this user

  useEffect(() => {
    const newChat = async () => {
      const { data } = await axiosInstance.post('/api/chats/new', {
        from: _id,
        to: onlineFriend,
      });
      console.log(data);
      return data;
    };
    const getChat = async () => {
      const { data } = await axiosInstance.post('/api/chats/', {
        userOne: _id,
        userTwo: onlineFriend,
      });
      return data;
    };
    getChat().then((res) => {
      if (res == null) {
        newChat().then((data) => {
          setChat(data);
        });
      }
    });
  }, [onlineFriend]);

  // const { data } = useQuery(['getOnlineUserInfo', onlineFriend], getUser(onlineFriend));

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={classes.onlineFriendWrapper}
      onClick={() => {
        setSelectedChat(chat);
      }}
    >
      <Indicator color="green" offset={5}>
        <Avatar size="md" src={onlineUser?.picture?.pictureURL} radius="xl" />
      </Indicator>
      <Text className={classes.onlineFriendUsername}>{onlineUser?.username}</Text>
    </div>
  );
};
