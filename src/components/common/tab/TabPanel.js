import React from 'react';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';

const TabPanel = ({ children, className = '', value = 0, index = 0, name = '' }) => {
  // const { children, className, value, index, name } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${name}-tabpanel-${index}`}
      aria-labelledby={`${name}-tab-${index}`}
      className={className}
    >
      {value === index && <>{children}</>}
    </div>
  );
};

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.any.isRequired,
//   value: PropTypes.any.isRequired,
// };

export default React.memo(TabPanel);
