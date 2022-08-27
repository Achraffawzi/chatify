import { Avatar, Indicator, Text } from "@mantine/core";
import React from "react";

import useStyles from "./OnlineFriend.styles.js";

const OnlineFriend = ({ username, picture }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.onlineFriendWrapper}>
      <Indicator color="green" offset={5}>
        <Avatar size="md" src={picture} radius="xl" />
      </Indicator>
      <Text className={classes.onlineFriendUsername}>{username}</Text>
    </div>
  );
};

export default OnlineFriend;