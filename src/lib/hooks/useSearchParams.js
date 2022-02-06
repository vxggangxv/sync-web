import React from 'react';
const { useLocation } = require('react-router-dom');

export default () => {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
};
