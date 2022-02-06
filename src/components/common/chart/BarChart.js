import React, { useRef, useState, useLayoutEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import _ from 'lodash';
import { _font } from 'styles/_variables';
import styled from 'styled-components';
import { color } from 'styles/utils';

const dummyData = [
  {
    country: 'AD',
    'hot dog': 107,
    'hot dogColor': 'hsl(297, 70%, 50%)',
    burger: 190,
    burgerColor: 'hsl(225, 70%, 50%)',
    sandwich: 34,
    sandwichColor: 'hsl(190, 70%, 50%)',
    kebab: 50,
    kebabColor: 'hsl(21, 70%, 50%)',
    fries: 20,
    friesColor: 'hsl(159, 70%, 50%)',
    donut: 98,
    donutColor: 'hsl(39, 70%, 50%)',
  },
  {
    country: 'AE',
    'hot dog': 23,
    'hot dogColor': 'hsl(142, 70%, 50%)',
    burger: 61,
    burgerColor: 'hsl(283, 70%, 50%)',
    sandwich: 180,
    sandwichColor: 'hsl(205, 70%, 50%)',
    kebab: 89,
    kebabColor: 'hsl(85, 70%, 50%)',
    fries: 175,
    friesColor: 'hsl(11, 70%, 50%)',
    donut: 84,
    donutColor: 'hsl(281, 70%, 50%)',
  },
  {
    country: 'AF',
    'hot dog': 200,
    'hot dogColor': 'hsl(253, 70%, 50%)',
    burger: 62,
    burgerColor: 'hsl(26, 70%, 50%)',
    sandwich: 22,
    sandwichColor: 'hsl(248, 70%, 50%)',
    kebab: 69,
    kebabColor: 'hsl(146, 70%, 50%)',
    fries: 9,
    friesColor: 'hsl(234, 70%, 50%)',
    donut: 92,
    donutColor: 'hsl(153, 70%, 50%)',
  },
  {
    country: 'AG',
    'hot dog': 12,
    'hot dogColor': 'hsl(73, 70%, 50%)',
    burger: 124,
    burgerColor: 'hsl(316, 70%, 50%)',
    sandwich: 168,
    sandwichColor: 'hsl(245, 70%, 50%)',
    kebab: 72,
    kebabColor: 'hsl(337, 70%, 50%)',
    fries: 53,
    friesColor: 'hsl(19, 70%, 50%)',
    donut: 42,
    donutColor: 'hsl(86, 70%, 50%)',
  },
  {
    country: 'AI',
    'hot dog': 106,
    'hot dogColor': 'hsl(87, 70%, 50%)',
    burger: 181,
    burgerColor: 'hsl(223, 70%, 50%)',
    sandwich: 5,
    sandwichColor: 'hsl(344, 70%, 50%)',
    kebab: 194,
    kebabColor: 'hsl(314, 70%, 50%)',
    fries: 33,
    friesColor: 'hsl(250, 70%, 50%)',
    donut: 161,
    donutColor: 'hsl(229, 70%, 50%)',
  },
  {
    country: 'AL',
    'hot dog': 129,
    'hot dogColor': 'hsl(225, 70%, 50%)',
    burger: 160,
    burgerColor: 'hsl(241, 70%, 50%)',
    sandwich: 7,
    sandwichColor: 'hsl(184, 70%, 50%)',
    kebab: 63,
    kebabColor: 'hsl(61, 70%, 50%)',
    fries: 140,
    friesColor: 'hsl(160, 70%, 50%)',
    donut: 28,
    donutColor: 'hsl(9, 70%, 50%)',
  },
  {
    country: 'AM',
    'hot dog': 174,
    'hot dogColor': 'hsl(283, 70%, 50%)',
    burger: 181,
    burgerColor: 'hsl(102, 70%, 50%)',
    sandwich: 89,
    sandwichColor: 'hsl(93, 70%, 50%)',
    kebab: 117,
    kebabColor: 'hsl(4, 70%, 50%)',
    fries: 159,
    friesColor: 'hsl(69, 70%, 50%)',
    donut: 127,
    donutColor: 'hsl(286, 70%, 50%)',
  },
];

export default function BarChart(props) {
  let {
    width = 1140,
    height = 270,
    margin = { top: 25, right: 25, bottom: 50, left: 60 },
    // colors = '#e46666',
    colors = color.blue,
    // data = dummyData,
    data = [],
    legendsData = [],
    legendsComponent,
    className = '',
    enableArea = false,
    padding = 0.1,
    axisBottom = {
      tickSize: 0,
      tickPadding: 15,
      tickRotation: -60,
      // tickRotation: 0,
      // legend: 'country',
      // legendOffset: 32,
      legendPosition: 'middle',
    },
  } = props;
  const containerStyle = {
    width,
    height,
  };

  const chartBoxRef = useRef();
  const legendsBoxRef = useRef();
  const [chartContainerHeight, setChartContainerHeight] = useState(height);

  // SECTION: init set height
  useLayoutEffect(() => {
    if (chartBoxRef.current && legendsBoxRef.current) {
      setChartContainerHeight(
        chartBoxRef.current.clientHeight + legendsBoxRef.current.clientHeight,
      );
    }
  }, [chartBoxRef.current?.height, legendsBoxRef.current?.height]);

  legendsData = [{ index: 0, label: 'created', color: '#E46666' }];

  // data = [
  //   {
  //     index: 0,
  //     id: 'created',
  //     color: '#e46666',
  //     data: [
  //       { x: '08-13', y: 0 },
  //       { x: '08-12', y: 0 },
  //       { x: '08-11', y: 5 },
  //       { x: '08-10', y: 0 },
  //       { x: '08-09', y: 0 },
  //       { x: '08-08', y: 0 },
  //       { x: '08-07', y: 2 },
  //     ],
  //   },
  // ];

  // data = _.orderBy(data, 'index', 'desc');

  // TODO: 백엔드 데이터 연동, formatting필요, line과 다른 포맷
  // data = [
  //   { x: '08-13', y: 0 },
  //   { x: '08-12', y: 0 },
  //   { x: '08-11', y: 5 },
  //   { x: '08-10', y: 0 },
  //   { x: '08-09', y: 0 },
  //   { x: '08-08', y: 0 },
  //   { x: '08-07', y: 2 },
  // ];

  const theme = {
    fontFamily: `${_font.roboto}`,
    textColor: '#555',
    axis: {
      ticks: {
        text: {
          fontSize: 12,
        },
        line: {
          stroke: '#E2E7EA',
          // strokeWidth: 1
        },
      },
    },
    legends: {
      text: {
        fontSize: 14,
        // textColor: 'white',
      },
    },
    grid: {
      line: {
        stroke: '#E2E7EA',
        // strokeWidth: 2,
        // strokeDasharray: '4 4',
      },
    },
    crosshair: {
      line: {
        // stroke: '#F0F7FB',
        stroke: '#0F3F62',
        // stroke: 'red',
        // strokeWidth: 50,
        strokeWidth: 1,
        strokeHeight: 100,
        // strokeOpacity: 0.5,
        strokeDasharray: 0,
        // strokeLinecap: "round"
      },
    },
  };

  const legendsConfig = legendsData
    ? []
    : [
        {
          anchor: 'bottom-left',
          direction: 'row',
          // justify: true,
          translateX: -50,
          translateY: 100,
          itemsSpacing: 5,
          itemDirection: 'left-to-right',
          itemWidth: 110,
          itemHeight: 20,
          // itemOpacity: 0.75,
          symbolSize: 14,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          itemTextColor: '#333',
          effects: [],
        },
      ];

  return (
    <Styled.LineChart
      style={{
        ...containerStyle,
        height: chartContainerHeight,
      }}
      data-component-name="BarChart"
      className={className}
    >
      <div className="chart__box" ref={chartBoxRef} style={containerStyle}>
        {!data.length && (
          <div className="chart__no_data" style={containerStyle}>
            Select valid type.
          </div>
        )}
        <ResponsiveBar
          data={data}
          // keys={['hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut']}
          // keys={['hot dog']}
          // indexBy="country"
          keys={['y']}
          indexBy="x"
          margin={margin}
          // margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          // padding={0.75}
          // padding={0.1}
          padding={padding}
          // innerPadding={10}
          groupMode="grouped"
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          // valueFormat={{ format: '', enabled: false }}
          // valueFormat={{ format: ' >-0,~', enabled: true }}
          // colors={{ scheme: 'nivo' }}
          // colors={`#e46666`}
          colors={colors}
          // defs={[
          //   {
          //     id: 'dots',
          //     type: 'patternDots',
          //     background: 'inherit',
          //     color: '#38bcb2',
          //     size: 4,
          //     padding: 1,
          //     stagger: true,
          //   },
          //   {
          //     id: 'lines',
          //     type: 'patternLines',
          //     background: 'inherit',
          //     color: '#eed312',
          //     rotation: -45,
          //     lineWidth: 6,
          //     spacing: 10,
          //   },
          // ]}
          // fill={[
          //   {
          //     match: {
          //       id: 'fries',
          //     },
          //     id: 'dots',
          //   },
          //   {
          //     match: {
          //       id: 'sandwich',
          //     },
          //     id: 'lines',
          //   },
          // ]}
          borderRadius={5}
          // borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={axisBottom}
          // axisBottom={{
          //   tickSize: 0,
          //   tickPadding: 15,
          //   tickRotation: -60,
          //   // tickRotation: 0,
          //   // legend: 'country',
          //   // legendOffset: 32,
          //   legendPosition: 'middle',
          // }}
          axisLeft={{
            // tickSize: 15,
            tickSize: 0,
            tickPadding: 20,
            tickRotation: 0,
            // legend: 'food',
            // legendOffset: -40,
            legendPosition: 'middle',
            format: e => Math.floor(e) === e && e,
          }}
          enableLabel={false}
          // pointSize={10}
          // pointColor={{ from: 'color', modifiers: [] }}
          // pointBorderWidth={2}
          // pointBorderColor={{ from: 'serieColor' }}
          // pointLabel="y"
          // pointLabelYOffset={-12}
          // labelSkipWidth={12}
          // labelSkipHeight={12}
          // labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          tooltip={data => (
            <span
              style={{
                display: 'inline-block',
                padding: '0px 5px',
                // padding: '3px 10px',
                fontSize: 18,
                color: data.color,
              }}
            >
              {data?.value}
            </span>
          )}
          // tooltip={(data, idx) => (
          //   <span key={idx} className="chart__tooltip" style={{ background: data.color }}>
          //     <span
          //       className="chart__tooltip_triangle"
          //       style={{ backgroundColor: data.color }}
          //     ></span>
          //     {data?.value}
          //   </span>
          // )}
          // legends={[
          //   {
          //     dataFrom: 'keys',
          //     anchor: 'bottom-right',
          //     direction: 'column',
          //     justify: false,
          //     translateX: 120,
          //     translateY: 0,
          //     itemsSpacing: 2,
          //     itemWidth: 100,
          //     itemHeight: 20,
          //     itemDirection: 'left-to-right',
          //     itemOpacity: 0.85,
          //     symbolSize: 20,
          //     effects: [
          //       {
          //         on: 'hover',
          //         style: {
          //           itemOpacity: 1,
          //         },
          //       },
          //     ],
          //   },
          // ]}
          // legends={[
          //   {
          //     anchor: 'bottom-left',
          //     direction: 'row',
          //     // justify: true,
          //     translateX: -50,
          //     translateY: 100,
          //     itemsSpacing: 5,
          //     itemDirection: 'left-to-right',
          //     itemWidth: 110,
          //     itemHeight: 20,
          //     // itemOpacity: 0.75,
          //     symbolSize: 14,
          //     symbolShape: 'circle',
          //     symbolBorderColor: 'rgba(0, 0, 0, .5)',
          //     itemTextColor: '#333',
          //     effects: [],
          //   },
          // ]}
          // legends={legendsConfig}
          theme={theme}
        />
      </div>
    </Styled.LineChart>
  );
}

const Styled = {
  LineChart: styled.div`
    position: relative;
    margin: 0 auto;
    background-color: #fff;
    & {
      .chart__tooltip {
        position: relative;
        top: -10px;
        padding: 8px;
        border-radius: 4px;
        color: #fff;
        .chart__tooltip_triangle {
          position: absolute;
          left: 50%;
          bottom: -8px;
          margin-left: -6px;
          transform: translateX(-50%);
          display: inline-block;
          width: 8px;
          height: 8px;
          transform: rotate(-45deg);
          transform-origin: 0 0;
        }
      }
      .chart__no_data {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: ${color.gray_week_font};
      }
    }
  `,
};
