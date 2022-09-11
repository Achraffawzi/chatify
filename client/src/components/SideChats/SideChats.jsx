import { Loader, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';

import React from 'react';
import { useSelector } from 'react-redux';

import axiosInstance from '../../axios';
import { CHATS_ENDPOINT } from '../../utils/constants';
import { SideChat } from '../SideChat/SideChat';

export const SideChats = ({ setSelectedChat }) => {
  /**
   * Redux store states
   */
  const userGlobalData = useSelector((store) => store.user);

  // Fetching all chats of current user
  const getChatsByUser = async (userID) => {
    const { data } = await axiosInstance.get(`${CHATS_ENDPOINT}/${userID}`);
    return data;
  };
  const { data, isLoading } = useQuery(['chatsByUserId', userGlobalData?._id], () =>
    getChatsByUser(userGlobalData?._id)
  );

  return (
    <>
      <Text style={{ marginBottom: '15px' }}>Conversations</Text>
      {isLoading ? (
        <Loader size="md" style={{ display: 'block', marginInline: 'auto' }} />
      ) : (
        <div>
          {data?.map((item) => (
            <div aria-hidden="true" onClick={() => setSelectedChat(item)} key={item._id}>
              <SideChat conversation={item} currentUserID={userGlobalData?._id} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};
