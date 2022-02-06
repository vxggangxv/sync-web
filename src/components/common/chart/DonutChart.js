import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import moment from 'moment';
import { ResponsiveLine } from '@nivo/line';
import { _font } from 'styles/_variables';
import { color } from 'styles/utils';
import { useImmer } from 'use-immer';
import { PieChart } from 'react-minimal-pie-chart';

export default function DonutChart({
  width = 250,
  noDataVisible = true,
  noDataHeight = 0,
  data = [],
  legendsData = [],
  children,
  lineWidth = 35,
  rounded = false,
  startAngle = -90,
}) {
  const containerStyle = {
    width,
    height: width,
  };

  const noDataStyle = {
    width,
    height: noDataHeight || width,
  };

  const defaultLabelStyle = {
    fontSize: '5px',
    fontFamily: 'sans-serif',
  };

  return (
    <Styled.PieChart style={containerStyle}>
      {!data.length && noDataVisible && (
        <div className="chart__no_data" style={noDataStyle}>
          No data.
        </div>
      )}
      <div className="chart__box">
        {children}
        <PieChart
          data={data}
          lineWidth={lineWidth}
          animate
          startAngle={startAngle}
          rounded={rounded}
          // lengthAngle={180}
          // label={({ dataEntry }) => dataEntry.value}
          // label={({ dataEntry }) => Math.round(dataEntry.percentage) + '%'}
          // labelStyle={index => ({
          //   ...defaultLabelStyle,
          //   // fill: '#000',
          //   fill: data[index].color,
          // })}
          // labelPosition={80}
          // radius={42}
        />
      </div>
    </Styled.PieChart>
  );
}

const Styled = {
  PieChart: styled.div`
    position: relative;
    margin: 0 auto;
    background-color: #fff;
    & {
      .chart__box {
        position: relative;
      }
      .chart__no_data {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        height: 350px;
        font-size: 16px;
        line-height: 1.3;
        color: #7c7c7c;
      }
    }
  `,
};
