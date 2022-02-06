import { TypedUseSelectorHook, useDispatch, useSelector, shallowEqual } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useShallowAppSelector: TypedUseSelectorHook<RootState> = fn => {
  return useSelector(fn, shallowEqual);
};
