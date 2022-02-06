import useInput from 'lib/hooks/useInput';
import React, { createContext, useEffect, useRef } from 'react';
import { AppActions, NotificationActions } from 'store/actionCreators';
import { useShallowAppSelector } from 'store/hooks';
import { isLogInSelector } from 'store/modules/auth';
import io from 'socket.io-client';
import store from 'store';
import { BASE_SOCKET_PRIVATE_URL } from 'lib/setting';
import { useDidUpdateEffect } from 'lib/utils';
// import { AppActions, EventActions } from 'store/actionCreators';

export const PrivateSocketContext = createContext<any>(null);

interface PrivateSocketProviderProps {
  value?: any;
  children: React.ReactNode;
}

export function PrivateSocketProvider({ value, children }: PrivateSocketProviderProps) {
  const { isLogIn, user } = useShallowAppSelector(state => ({
    isLogIn: isLogInSelector(state),
    user: state.user.user,
  }));
  const socketState = useRef<any>(null);
  // change new Events 변경 알림 -> NotificationContainer 에서 받아서 reFetch
  const isChangeNewEvents = useInput(null);

  useEffect(() => {
    console.log('socketState', socketState);
  }, [socketState]);

  useEffect(() => {
    if (isLogIn) {
      const socket = io(BASE_SOCKET_PRIVATE_URL, {
        path: '/notification/socket.io',
        reconnectionDelayMax: 10000,
        autoConnect: false,
        auth: { 'x-access-token': store.getState().auth.accessToken },
      });
      socket.open();
      socketState.current = socket;

      socket.on('connect', () => {
        console.log('private socket connect_', socket.id, socket.connected);
        // emit auth
        handleEmitAuth();
      });

      socket.on('disconnect', () => {
        console.log('private socket connect_dis', socket.connected);
        // console.log('socket.id', socket.id);
      });

      socket.on('connect_error', error => {
        console.log('private socket connect_error', error);
        socket.close();
      });

      NotificationActions.fetch_new_notifications_request();

      // 새로운 notifications 왔을 경우 fetch new events
      // socket.on('notification', data => {
      //   console.log('socket notification', data);
      //   const { eventType, eventTitle, params, userCode } = data;

      //   AppActions.show_toast({
      //     eventType,
      //     params,
      //     delay: 5000,
      //     // isAutoRemove: false,
      //     ...convertEventMessage({ eventType, eventTitle, params }),
      //     message: t(`NOTIFICATION_EVENT_TITLE_${eventType}`),
      //   });

      //   // request api
      //   EventActions.fetch_new_events_request();
      //   isChangeNewEvents.setValue(true);
      // });
    }
  }, [isLogIn]);

  // signOut 발생시 socket close
  useDidUpdateEffect(() => {
    if (!!socketState.current && !user) {
      console.log('private socket close');
      socketState.current.close();
      // setIsConnect(null);
    }
  }, [socketState.current, user]);

  const handleEmitAuth = () => {
    const { email, syncUid, groupCode } = user;
    if (!email || !syncUid || !groupCode)
      return AppActions.show_toast({
        type: 'error',
        message: 'Private Socket Auth\n Bad Request 400',
      });
    console.log('private auth', email);
    socketState.current.emit('auth', { email, syncUid, groupCode });
  };

  return (
    <PrivateSocketContext.Provider value={{ isChangeNewEvents }}>
      {children}
    </PrivateSocketContext.Provider>
  );
}
