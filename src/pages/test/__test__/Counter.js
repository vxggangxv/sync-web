import React, { useState, useCallback } from 'react';

const style = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

function Counter() {
  const [count, setCount] = useState(0);

  const onClickPlus = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  const onClickMinus = useCallback(() => {
    setCount(count - 1);
  }, [count]);

  return (
    <div className="counter">
      <h1>I'm counter</h1>
      <button className="plus-button" onClick={onClickMinus}>
        -
      </button>
      <p className="count">{count}</p>
      <button className="minus-button" onClick={onClickPlus}>
        +
      </button>
    </div>
  );
}

export default Counter;
