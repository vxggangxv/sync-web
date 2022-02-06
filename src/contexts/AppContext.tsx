import React, { createContext, useEffect, useState } from 'react';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { useLocation } from 'react-router-dom';
import { cutUrl } from 'lib/library';
import _ from 'lodash';
import { isLogInSelector } from 'store/modules/auth';
import { useShallowAppSelector } from 'store/hooks';
import { PrivateSocketProvider } from './PrivateSocketContext';
import { ProjectSocketProvider } from './ProjectSocketContext';
import { lightTheme, darkTheme } from 'styles/utils';

interface State {
  themeMode: string;
}

export const AppContext = createContext<State | any>(null);

// export function AppProvider<React.FunctionComponent>({ children }: { children: React.ReactNode }) {
export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user, isLogin, signUpSuccess, signUpFailure, signOutSuccess } = useShallowAppSelector(
    state => ({
      user: state.user.user,
      isLogin: isLogInSelector(state),
      signUpSuccess: state.auth.signUp.success,
      signUpFailure: state.auth.signUp.failure,
      signOutSuccess: state.auth.signOut.success,
    }),
  );
  const { pathname } = useLocation();
  const isProjectPage = `${cutUrl(pathname)}` === 'project';
  const isAuthPage = `${cutUrl(pathname)}` === 'auth';
  const userCode = user?.userCode;
  const [appTheme, setAppTheme] = useState('light');
  const theme = appTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <AppContext.Provider value={{ theme, setAppTheme }}>
      <PrivateSocketProvider>
        <ProjectSocketProvider>{children}</ProjectSocketProvider>
      </PrivateSocketProvider>
    </AppContext.Provider>
  );
}

// export const useAppContextValue = () => {
//   const value = useContext(AppContext);
//   return value;
// };
