import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  wrapper: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    maxWidth: '100%',
    width: '650px',
    marginBottom: '40px',
  },

  text: {
    fontSize: '20px',
  },

  link: {
    color: theme.colors.primary[5],
    textDecoration: 'none',
  },
}));
