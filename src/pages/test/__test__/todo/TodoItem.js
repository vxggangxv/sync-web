import React, { useCallback } from 'react';

const TodoItem = ({ todo, onToggle, onRemove }) => {
  const { id, text, done } = todo;
  const toggle = useCallback(() => onToggle(id), [id, onToggle]);
  const remove = useCallback(() => onRemove(id), [id, onRemove]);

  const handleClick = config => {
    const { type = '' } = config;

    if (type === 'toggle') {
      onToggle({ value: id });
      return;
    }

    if (type === 'remove') {
      onRemove({ value: id });
      return;
    }
  };

  return (
    <li>
      <span
        style={{
          textDecoration: done ? 'line-through' : 'none',
        }}
        // onClick={() => handleClick({ type: 'toggle', value: id })}
        onClick={toggle}
      >
        {text}
      </span>
      {/* <button onClick={() => handleClick({ type: 'remove', value: id })}>삭제</button> */}
      <button onClick={remove}>삭제</button>
    </li>
  );
};

export default React.memo(TodoItem);
