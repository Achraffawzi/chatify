import { useCallback, useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { io } from "socket.io-client";
import {
  AppShell,
  Navbar,
  Header,
  Text,
  useMantineTheme,
  ScrollArea,
  TextInput,
  Avatar,
  Drawer,
  Paper,
  Button,
} from "@mantine/core";
import OnlineFriend from "../../components/OnlineFriend/OnlineFriend.jsx";
import Chat from "../../components/Chat/Chat.jsx";
import NoChatSelected from "../../assets/images/noChatSelected.svg";
import Profile from "../../components/Profile/Profile.jsx";

import useStyles from "./Messenger.styles.js";
import { useSelector } from "react-redux";

import axiosInstance from "../../axios";
import SideChats from "../../components/SideChats/SideChats.jsx";
import AppHeader from "../../components/AppHeader/AppHeader.jsx";

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
  const { username, picture, _id, friends, reqSent, reqRecieved } = useSelector(
    (store) => store.user.user
  );

  /**
   * Component core states
   */
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchedUser, setSearchedUser] = useState(null);
  const [searchedUsername, setSearchedUsername] = useState("");

  /**
   * ENUMS
   */
  const Relationships = {
    Me: Symbol("me"),
    Friend: Symbol("friend"),
    Sent: Symbol("sent"),
    Recieved: Symbol("recieved"),
  };

  // abort prev requests when searching for a user
  useEffect(() => {
    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/users?username=${searchedUsername}`,
          {
            signal: controller.signal,
          }
        );
        // handleChangeUser(data);
        setSearchedUser(data); // null ????
        // console.log(searchedUser);
      } catch (err) {
        console.log(err.message);
      }
    };

    if (searchedUsername !== "") fetchUser();
    else setSearchedUser(null);

    return () => {
      controller.abort();
    };
  }, [searchedUsername]);

  // get the relationship of current user and a user
  const getRelationship = (user) => {
    if (user?._id === _id) return Relationships.Me;
    if (friends.includes(user?._id)) return Relationships.Friend;
    if (reqSent.includes(user?._id)) return Relationships.Sent;
    if (reqRecieved.includes(user?._id)) return Relationships.Recieved;
    return "stranger";
  };

  /**
   * render the buttons (unfriend, add friend, cancel request)
   * based on the relationship between current user and searched user
   */
  // const RenderRelationshipButtons = useCallback(() => {

  // }, [searchedUsername]);

  useEffect(() => {
    const RenderRelationshipButtons = () => {
      if (searchedUsername !== "") {
        const relationship = getRelationship(searchedUser);
        switch (relationship) {
          case Relationships.Me:
            return <></>;

          case Relationships.Friend:
            return (
              <Button
                style={{
                  backgroundColor: "rgba(200, 0, 0, 0.5)",
                  color: "#fff",
                }}
              >
                Unfriend
              </Button>
            );

          case Relationships.Recieved:
            return (
              <>
                <Button style={{ backgroundColor: "green", color: "#fff" }}>
                  Accept
                </Button>
                <Button
                  style={{
                    backgroundColor: "rgba(200, 0, 0, 0.5)",
                    color: "#fff",
                  }}
                >
                  Refuse
                </Button>
              </>
            );

          case Relationships.Sent:
            return <Button>Cancel request</Button>;

          default:
            return (
              <Button style={{ backgroundColor: "dodgerblue", color: "#fff" }}>
                Add friend
              </Button>
            );
        }
      }
    };
    const Buttons = RenderRelationshipButtons();
  }, [searchedUser]);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
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
            base: "70vw",
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
                style={{ marginRight: "10px" }}
              />
              <div>
                <div>
                  <Text size={17}>{username}</Text>
                </div>
                <div>
                  <Text
                    size={12}
                    color="blue"
                    style={{ cursor: "pointer" }}
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
                style={{ flex: 1, position: "relative" }}
                value={searchedUsername}
                onChange={(e) => setSearchedUsername(e.target.value)}
                autoComplete="false"
              />
              {/* search result */}
              {searchedUser && (
                <div>
                  <Paper
                    p={7}
                    withBorder
                    className={classes.inputBoxSearchResult}
                  >
                    <Avatar
                      src={searchedUser?.picture?.pictureURL}
                      size="md"
                      radius="xl"
                    />
                    <Text>{searchedUser?.username}</Text>

                    {/* action button(s) */}
                    {/* <RenderRelationshipButtons /> */}
                  </Paper>
                </div>
              )}
            </div>

            {/* Online Friends */}
            <div className={classes.onlineFriendsWrapper}>
              <Text style={{ marginBottom: "15px" }}>Online friends</Text>
              <div className={classes.onlineFriends}>
                {new Array(4).fill(0).map((_, index) => (
                  <OnlineFriend
                    key={index}
                    picture="https://images.unsplash.com/photo-1657299170222-1c67dc056b70?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60"
                    username="Alpha"
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
