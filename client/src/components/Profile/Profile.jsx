import { Avatar, Text } from '@mantine/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useStyles from './Profile.styles';
import axiosInstance from '../../axios';
import { logout } from '../../redux/userSlice';

export const Profile = () => {
  const { username, email, picture } = useSelector((store) => store.user.user);
  const { classes } = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    localStorage.removeItem('jwt');
    await axiosInstance.get('/api/auth/logout');
    dispatch(logout());
    navigate('/auth/signin');
  };

  return (
    <div className={classes.profile}>
      <Avatar src={picture.pictureURL} size="250px" className={classes.avatar} />
      <Text className={classes.usernameEmail}>
        {username}
        <Text>{email}</Text>
      </Text>
      <Text className={classes.logoutButton} onClick={handleLogout}>
        Logout
      </Text>
    </div>
  );
};
