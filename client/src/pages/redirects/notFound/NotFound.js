import React from 'react';
import { Container, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import NotFoundSVG from '../../../assets/images/notFound.svg';
import useStyles from './NotFound.styles';

export const NotFound = () => {
  const { classes } = useStyles();
  return (
    <Container className={classes.wrapper}>
      <img className={classes.image} src={NotFoundSVG} alt="Page Not Found" />
      <Text className={classes.text}>Page Not Found!</Text>
      <Link className={classes.link} to="/messenger">
        Back to Messenger
      </Link>
    </Container>
  );
};

// export default NotFound;
