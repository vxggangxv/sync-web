import { useHistory } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';
import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import useInput from 'lib/hooks/useInput';

import T from 'components/common/text/T';

import CustomSpan from 'components/common/text/CustomSpan';

import { EmployeeActions, UnitActions, UtilActions } from 'store/actionCreators';
import BarChart from 'components/common/chart/BarChart';
import { useShallowAppSelector } from 'store/hooks';
import { useDidUpdateEffect } from 'lib/utils';

interface SalesPointInfoProps {
  // page: object | any;
  // period: object | any;
  // checkedProjectProcess: object | any;
  // keyword: object | any;
}

function SalesPointContainer({}: SalesPointInfoProps) {
  const { fetchIndicationFormat } = useShallowAppSelector(state => ({
    fetchIndicationFormat: state.util.indicationFormat.data,
  }));

  const [totalSalesData, setTotalSalesData] = useState<object[] | []>([]);
  const chartData = [
    { x: 'Mar', y: 18 },
    { x: 'Apr', y: 13 },
    { x: 'May', y: 26 },
    { x: 'Jun', y: 12 },
    { x: 'Jul', y: 12 },
    { x: 'Aug', y: 11 },
  ];

  useEffect(() => {
    const animation = setTimeout(() => setTotalSalesData(chartData), 1);
    return () => {
      clearTimeout(animation);
    };
  }, [chartData]);

  useEffect(() => {
    console.log('Init ______ [ SalesPointContainer ]');
    // init
  }, []);
  return (
    <StyledSalesPoint data-component-name="SalesPoint">
      <div className="salesPoint__container">
        <h1 className="salesPoint__title_box">
          <img className="salesPoint__title_icon" />
          <CustomSpan fontSize={26} fontWeight={500} marginLeft={30}>
            <T>Sales Point</T>
          </CustomSpan>
        </h1>
        <div className="salesPoint__content_wrapper">
          <div className="salesPoint__info_box">
            <div className="salesPoint__info_today">
              <CustomSpan fontSize={33} fontWeight={800} fontColor="#00A4E3">
                <T>Today</T>
              </CustomSpan>
              <CustomSpan fontSize={14} fontColor="#858997">
                06.17.20 12:22
              </CustomSpan>
            </div>
            <div className="salesPoint__info_project">
              <CustomSpan fontSize={52} fontWeight={800} fontColor="#303030">
                10
              </CustomSpan>
              <CustomSpan fontSize={23} marginLeft={13} fontWeight={400} fontColor="#7C7C7C">
                <T>Projects</T>
              </CustomSpan>
            </div>
          </div>
          <div className="salesPoint__chart_box">
            <div className="salesPoint__chart_title">
              <CustomSpan fontSize={19} fontWeight={800}>
                <T>Projects</T>
              </CustomSpan>
            </div>
            <BarChart
              width="100%"
              height={200}
              data={totalSalesData}
              padding={0.9}
              colors={'#00A4E3'}
              margin={{ top: 5, right: 70, bottom: 30, left: 32 }}
              axisBottom={{
                tickSize: 0,
                tickPadding: 15,
                tickRotation: 0,
                legendPosition: 'middle',
              }}
              className="salesPoint__chart"
            />
          </div>
        </div>
      </div>
    </StyledSalesPoint>
  );
}

const StyledSalesPoint = styled.section<{}>`
  .salesPoint__container {
    padding-bottom: 40px;
    flex-wrap: wrap;
    width: 466px;
    margin-bottom: 20px;

    .salesPoint__title_box {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      .salesPoint__title_icon {
        width: 60px;
        height: 60px;
      }
    }

    .salesPoint__content_wrapper {
      width: 100%;
      height: 448px;
      background-color: #fcfcfc;
      border-radius: 15px;
      box-shadow: inset 3px 3px 6px rgb(0 0 0 / 16%);
      padding-top: 45px;
      padding-left: 30px;
      .salesPoint__info_box {
        display: flex;
        align-items: center;
        margin-bottom: 50px;
        .salesPoint__info_today {
          width: 140px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          flex-wrap: wrap;
          row-gap: 10px;
        }
        .salesPoint__info_project {
          display: flex;
          align-items: center;
        }
      }
      .salesPoint__chart_box {
        .salesPoint__chart_title {
          margin-bottom: 45px;
        }
        .salesPoint__chart {
          background-color: transparent;
          margin-left: 0;
        }
      }
    }
  }
`;

export default React.memo(SalesPointContainer);
