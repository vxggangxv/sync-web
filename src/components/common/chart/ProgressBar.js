import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import { color } from 'styles/utils';

export const ProgressBar = React.memo(({ percent }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // NOTE: transition 효과를 위한 딜레이
    setTimeout(() => {
      setProgress(Math.floor(percent * 100));
    }, 100);
  }, []);

  return (
    <Styled.ProgressBar data-component-name="ProgressBar" width={progress}>
      <div className={cx('dashboard__progress_in_bar', { active: progress })}></div>
    </Styled.ProgressBar>
  );
});

const Styled = {
  ProgressBar: styled.div`
    position: relative;
    display: block;
    width: 100%;
    height: 24px;
    border-radius: 24px;
    background-color: #ddd;
    margin-top: 15px;
    overflow: hidden;
    .dashboard__progress_in_bar {
      position: absolute;
      background: ${color.time_line_bg_gradient};
      height: 100%;
      border-radius: 50px;
      width: 0;
      transition: 0.3s width;
      &.active {
        width: ${({ width }) => `${width}%`};
      }
    }
  `,
};
