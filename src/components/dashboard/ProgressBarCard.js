import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { color, font } from 'styles/utils';
import { DateConverter } from 'components/common/convert';
import { ProgressBar } from 'components/common/chart/ProgressBar';

export default function ProgressBarCard({ name = '-', startPeriod = 0, endPeriod = 0 }) {
  // const startDate = moment.unix(startPeriod).format('YYYY-MM-DD');
  // const endDate = moment.unix(endPeriod).format('YYYY-MM-DD');
  const period = moment.unix(endPeriod).diff(moment.unix(startPeriod), 'd');
  const now = moment().diff(moment.unix(startPeriod), 'd');

  // console.log('period', period);
  // console.log('now', now);

  return (
    <Styled.ProgressBarCard data-component-name="ProgressCard">
      <div className="dashboard__progress_title">{name}</div>
      <div className="dashboard__progress_date">
        <DateConverter timestamp={startPeriod} format="YYYY-MM-DD" />
        {' ~ '}
        <DateConverter timestamp={endPeriod} format="YYYY-MM-DD" />
      </div>

      <ProgressBar percent={now / period} />
    </Styled.ProgressBarCard>
  );
}

const Styled = {
  ProgressBarCard: styled.div`
    padding: 15px;
    border: solid 1px #e2e7ea;
    border-radius: 5px;
    &:not(:first-child) {
      margin-top: 10px;
    }
    & {
      .dashboard__progress_title {
        ${font(16, color.black_font)};
        font-weight: 700;
        display: inline-block;
        line-height: 16px;
      }
      .dashboard__progress_date {
        ${font(13, color.black_font)};
        float: right;
        line-height: 16px;
      }
    }
  `,
};
