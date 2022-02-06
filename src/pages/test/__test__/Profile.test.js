import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Profile from './Profile';

describe('<Profile />', () => {
  it('matches snapshot', () => {
    const utils = render(<Profile username="juncoder" name="준코더" />);
    expect(utils.container).toMatchSnapshot();
  });
  it('shows the props correctly', () => {
    const utils = render(<Profile username="juncoder" name="준코더" />);
    utils.getByText('juncoder'); // velopert 라는 텍스트를 가진 엘리먼트가 있는지 확인
    utils.getByText('(준코더)'); // (준코더) 이라는 텍스트를 가진 엘리먼트가 있는지 확인
    utils.getByText(/준/i); // 정규식 /준/ 을 통과하는 엘리먼트가 있는지 확인
  });
});
