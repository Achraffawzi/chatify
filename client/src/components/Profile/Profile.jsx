import { Avatar, Text } from '@mantine/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useStyles from './Profile.styles';
import axiosInstance from '../../axios';
import { logout } from '../../redux/userSlice';
import { JWT, LOGOUT_ENDPOINT, SIGNIN_ROUTE } from '../../utils/constants';

export const Profile = () => {
  const userGlobalData = useSelector((store) => store.user);
  const { classes } = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    localStorage.removeItem(JWT);
    await axiosInstance.get(LOGOUT_ENDPOINT);
    dispatch(logout());
    navigate(SIGNIN_ROUTE);
  };

  return (
    <div className={classes.profile}>
      <Avatar src={userGlobalData?.picture.pictureURL} size="250px" className={classes.avatar} />
      <Text className={classes.usernameEmail}>
        {userGlobalData?.username}
        <Text>{userGlobalData?.email}</Text>
      </Text>
      <Text className={classes.logoutButton} onClick={handleLogout}>
        Logout
      </Text>
    </div>
  );
};
