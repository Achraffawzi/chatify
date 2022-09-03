import { useState, useRef, useEffect } from 'react';
import {
  AppShell,
  Avatar,
  Button,
  Drawer,
  Header,
  Loader,
  Navbar,
  Paper,
  ScrollArea,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { io } from 'socket.io-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, cancelFriendRequest } from '../../redux/userSlice';
import NoChatSelected from '../../assets/images/noChatSelected.svg';

import useStyles from './Messenger.styles';

import axiosInstance from '../../axios';
import { AppHeader, Profile, Chat, OnlineFriend, SideChats } from '../../components';

export default function Messenger() {
  /**
   * Mantine states
   */
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [drawerOpened, setDrawerOpened] = useState(false);

  /**
   * Redux store states
   */
  const { _id, username, picture, friends, reqSent, reqRecieved } = useSelector(
    (store) => store.user.user
  );
  const dispatch = useDispatch();

  /**
   * Component core states
   */
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchedUsername, setSearchedUsername] = useState('');

  /**
   * Getting user info
   */
  // const getUser = async (id) => {
  //   const { data } = await axiosInstance.get(`/api/users?userID=${id}`);
  //   return data;
  // };
  // const { data:  = useQuery(['getCurrentUser', _id], getUser(_id));

  /**
   * fetching user based on username state
   */
  const getUserByUsername = async (searchedUserName) => {
    const { data } = await axiosInstance.get(`/api/users?username=${searchedUserName}`);
    return data;
  };

  const { data: searchedUser, isLoading } = useQuery(
    ['user', searchedUsername],
    () => getUserByUsername(searchedUsername),
    {
      enabled: searchedUsername !== '',
    }
  );

  /**
   * Add new friend handler
   */
  const mutation = useMutation((payload) => axiosInstance.post('/api/users/sendRequest', payload));
  const handleAddFriend = () => {
    mutation.mutate(
      { from: _id, to: searchedUser._id },
      {
        onSuccess: ({ data }) => {
          console.log(data?.message);
          // update user store
          dispatch(updateUser({ name: 'reqSent', value: searchedUser._id }));
        },
      }
    );
  };

  /**
   * cancel friend request handler
   */
  const mutation_cancelFriendRequest = useMutation((payload) =>
    axiosInstance.post('/api/users/cancelfriendrequest', payload)
  );
  const handleCancelFriendRequest = () => {
    mutation_cancelFriendRequest.mutate(
      { from: _id, to: searchedUser._id },
      {
        onSuccess: () => {
          //  console.log(data?.message);
          // update user store
          dispatch(cancelFriendRequest(searchedUser._id));
        },
      }
    );
  };

  /**
   * get the relationship between current user and searched user
   * (friend, reqSent, reqRecieved, stranger)
   */
  const getRelationship = (user) => {
    if (user?._id === _id) return <></>;
    if (friends.includes(user?._id)) {
      return (
        <Button
          style={{
            backgroundColor: 'rgba(200, 0, 0, 0.5)',
            color: '#fff',
          }}
        >
          Unfriend
        </Button>
      );
    }
    if (reqSent.includes(user?._id)) {
      return <Button onClick={handleCancelFriendRequest}>Cancel request</Button>;
    }
    if (reqRecieved.includes(user?._id)) {
      return (
        <>
          <Button style={{ backgroundColor: 'green', color: '#fff' }}>Accept</Button>
          <Button
            style={{
              backgroundColor: 'rgba(200, 0, 0, 0.5)',
              color: '#fff',
            }}
          >
            Refuse
          </Button>
        </>
      );
    }
    return (
      <Button style={{ backgroundColor: 'dodgerblue', color: '#fff' }} onClick={handleAddFriend}>
        Add friend
      </Button>
    );
  };

  /**
   * ========== working with socket =============
   */
  const socket = useRef();
  const [onlineFriends, setOnlineFriends] = useState([]);
  // when client first connects
  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SERVER_URI);
  }, []);

  /**
   * get users that are friends with current user
   */
  const getFriendsFromUsers = (users) =>
    friends.filter((friend) => users.some((u) => u.userID === friend));

  // add user to online users when connected
  useEffect(() => {
    socket.current.emit('newUser', _id);
    socket.current.on('getOnlineUsers', (users) => {
      setOnlineFriends(getFriendsFromUsers(users));
    });
  }, [_id]);

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="md"
      header={
        <Header height={70} p="md">
          <AppHeader navOpened={setOpened} />
        </Header>
      }
      navbar={
        <Navbar
          p="xs"
          width={{
            // When viewport is larger than theme.breakpoints.sm, Navbar width will be 300
            sm: 300,

            // When viewport is larger than theme.breakpoints.lg, Navbar width will be 400
            lg: 400,

            // When other breakpoints do not match base width is used, defaults to 100%
            base: '70vw',
          }}
          hidden={!opened}
        >
          <Navbar.Section component={ScrollArea} grow mt="md">
            {/* Current user info */}
            <div className={classes.userInfo}>
              <Avatar
                src={picture.pictureURL}
                size="md"
                radius="xl"
                style={{ marginRight: '10px' }}
              />
              <div>
                <div>
                  <Text size={17}>{username}</Text>
                </div>
                <div>
                  <Text
                    size={12}
                    color="blue"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setDrawerOpened(true)}
                  >
                    See profile
                  </Text>

                  {/* PROFILE DRAWER */}
                  <Drawer
                    opened={drawerOpened}
                    onClose={() => setDrawerOpened(false)}
                    title="Profile"
                    padding="xl"
                    size="lg"
                    position="right"
                  >
                    <Profile />
                  </Drawer>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className={classes.inputBox}>
              <TextInput
                placeholder="Enter your message"
                style={{ flex: 1, position: 'relative' }}
                value={searchedUsername}
                onChange={(e) => setSearchedUsername(e.target.value)}
                autoComplete="off"
              />
              {/* search result */}
              {searchedUser && searchedUsername !== '' && (
                <div>
                  <Paper p={7} withBorder className={classes.inputBoxSearchResult}>
                    {isLoading && <Loader />}
                    <Avatar src={searchedUser?.picture?.pictureURL} size="md" radius="xl" />
                    <Text>{searchedUser?.username}</Text>

                    {/* action button(s) */}
                    {getRelationship(searchedUser)}
                  </Paper>
                </div>
              )}
            </div>

            {/* Online Friends */}
            <div className={classes.onlineFriendsWrapper}>
              <Text style={{ marginBottom: '15px' }}>Online friends</Text>
              <div className={classes.onlineFriends}>
                {onlineFriends.map((onlineFriend) => (
                  <OnlineFriend
                    key={onlineFriend}
                    onlineFriend={onlineFriend}
                    setSelectedChat={setSelectedChat}
                  />
                ))}
              </div>
            </div>

            {/* Side chat */}
            <div className={classes.sideChatWrapper}>
              <SideChats setSelectedChat={setSelectedChat} />
            </div>
          </Navbar.Section>
        </Navbar>
      }
    >
      <div>
        {!selectedChat ? (
          <div className={classes.noChatSelectedWrapper}>
            <img
              className={classes.noChatSelectedSVG}
              src={NoChatSelected}
              alt="no chat selected"
            />
            <Text className={classes.noChatSelectedText}>
              Start a new Conversation with someone now and have fun!
            </Text>
          </div>
        ) : (
          <Chat chat={selectedChat} />
        )}
      </div>
    </AppShell>
  );
}
