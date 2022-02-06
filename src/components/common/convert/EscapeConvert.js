import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

function EscapeConvert({ prev = '\n', next = <br />, content = '' }) {
  if (!content?.trim()) return null;

  const splitContent = content.split(prev);
  const splitContentLastIdx = splitContent.length - 1;

  return (
    <>
      {splitContent.map((item, idx) => {
        // console.log(`${item} ${idx}`, 'item');
        return (
          <Fragment key={idx}>
            {item}
            {splitContentLastIdx !== idx && next}
          </Fragment>
        );
      })}
    </>
  );
}

EscapeConvert.propTypes = {
  content: PropTypes.any,
};

export default EscapeConvert;
