import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('check init count', () => {
  const { getByText } = render(<Counter />);

  // '+'버튼이 있는지
  const plusElement = getByText('+');
  // expect(plusElement).toBeInTheDocument();
  fireEvent.click(plusElement);

  // '1'이 있는지
  const countElement = getByText('1');
  expect(countElement).toBeInTheDocument();

  // '-'버튼이 있는지
  const minusElement = getByText('-');
  // expect(minusElement).toBeInTheDocument();
  fireEvent.click(minusElement);

  // '0'이 있는지
  const countElement2 = getByText('0');
  expect(countElement2).toBeInTheDocument();
});
