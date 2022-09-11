import React from 'react';
import { Container, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import UnauthorizedSVG from '../../../assets/images/unauthorized.svg';
import useStyles from './Unauthorized.style';
import { SIGNIN_ROUTE } from '../../../utils/constants';

export const Unauthorized = () => {
  const { classes } = useStyles();
  return (
    <Container className={classes.wrapper}>
      <img
        className={classes.image}
        src={UnauthorizedSVG}
        alt="You're trying to access a private page, please sign in first!"
      />
      <Text className={classes.text}>Unauthorized Access!</Text>
      <Text className={classes.text}>
        You are trying to access a private page, please sign in first!
      </Text>
      <Link className={classes.link} to={SIGNIN_ROUTE}>
        Back to Login
      </Link>
    </Container>
  );
};
