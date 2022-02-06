import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import moment from 'moment';
import cx from 'classnames';
//ant react module
import { DatePicker } from 'antd';
import 'styles/lib/antPicker.css';
// import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { color } from 'styles/utils';
import { icon_calendar02 } from 'components/base/images';
const { RangePicker } = DatePicker;

/**
 * @param {*} props
 * defaultValue : Date, // moment 객체
 * placeholder : string //
 * showToday : boolean // 하단에 today 버튼 여부
 * onChange : function(date, dateString) // 날짜 변경 데이터를 컨트롤할 함수
 * disabledDate : boolean, // 지난 날짜 선택 여부
 * 
 *  <CustomDatePicker
    value={moment.unix(dueDate)}
    className="CreateCase_input date"
    onChange={handleChange('date')}
    style={{ width: '100%', height: '40px' }}
  />
 */
const CustomDatePicker = props => {
  const [date, setDate] = useState(null);
  let {
    className,
    disabled = false,
    width,
    height,
    fullWidth,
    borderColor = '#B5B7C1',
    borderRadius,
    fontSize,
    style,
    value,
    defaultVisibleValue = null,
    defaultValue = null,
    placeholder = 'Pick a day',
    showToday = false,
    onChange,
    disabledDate = false,
    onBlur,
    type = 'date',
  } = props;

  if (type === 'rangeDate') placeholder = ['Start date', 'End date'];

  // value가 안 올경우 보여주기식 함수, value가 필수이기때문에 사용이 안됨.
  const handleChangeDate = value => {
    console.log('default date pick');
    const dateValue = value ? moment(value) : null;
    setDate(dateValue);
  };

  const setDisabledDate = current => {
    // 이전 날짜 선택 안됨(당일 선택 불가능)
    // return current && current < moment().endOf('day');
    // 이전 날짜 계산하는 함수(당일 선택 가능)
    return current < moment().startOf('day');
  };

  const handleChange = config => {};

  // console.log(value, 'value');
  // console.log(defaultValue, 'defaultValue');
  // console.log(moment.unix(moment().unix()), 'moment');
  // console.log(moment(), 'moment');

  return (
    <Styled.DatePicker
      className={cx('datePicker__box', className)}
      width={width}
      height={height}
      fullWidth={fullWidth}
      borderColor={borderColor}
      borderRadius={borderRadius}
      fontSize={fontSize}
      type={type}
    >
      {type === 'date' && (
        <DatePicker
          disabled={disabled}
          style={style}
          value={value || defaultVisibleValue}
          className="datePicker__content"
          defaultValue={defaultValue ? defaultValue : moment()}
          placeholder={placeholder}
          showToday={showToday}
          onChange={onChange || handleChangeDate}
          blur={onBlur}
          disabledDate={disabledDate && setDisabledDate}
          suffixIcon={<img src={icon_calendar02} alt="calendar" />}
        />
      )}
      {type === 'rangeDate' && (
        <RangePicker
          disabled={disabled}
          style={style}
          value={value || defaultVisibleValue}
          className="rangePicker__content"
          defaultValue={defaultValue ? defaultValue : moment()}
          placeholder={placeholder}
          showToday={showToday}
          onChange={onChange || handleChangeDate}
          blur={onBlur}
          disabledDate={disabledDate && setDisabledDate}
          suffixIcon={<img src={icon_calendar02} alt="calendar" />}
        />
      )}
      <Styled.GlobalStyles />
    </Styled.DatePicker>
  );
};

CustomDatePicker.propsTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
};

const Styled = {
  DatePicker: styled.div`
    position: relative;
    width: ${({ width }) => (width && typeof width === 'string' ? width : width && width + 'px')};
    width: ${({ fullWidth }) => fullWidth && `100%`};
    height: ${({ height }) =>
      height && typeof height === 'string' ? height : height && height + 'px'};
    border-radius: ${({ borderRadius }) => (borderRadius ? `${borderRadius}px` : `5px`)};
    .MuiOutlinedInput-adornedEnd {
      width: 100%;
    }
    &:not(.ant-picker-focused).error {
      .ant-picker {
        border-color: ${color.red};
      }
    }
    .ant-picker {
      width: 100%;
      height: 100%;
      padding-top: 5px;
      padding-bottom: 5px;
      border-radius: inherit;
      border-color: ${({ borderColor }) => borderColor};
      &.ant-picker-focused {
        box-shadow: none;
      }
      .ant-picker-input > input {
        font-size: ${({ fontSize }) =>
          fontSize && typeof fontSize === 'string' ? fontSize : fontSize && fontSize + 'px'};
      }
      .ant-picker-input > input[disabled],
      &.ant-picker-disabled {
        background-color: #fff;
        cursor: default;
      }
      &.ant-picker-disabled {
        border-color: #bbbbbb;
      }
      .ant-picker-input {
        width: ${({ type }) => type === 'rangeDate' && `80px`};
      }
      .ant-picker-suffix {
        display: flex;
        position: absolute;
        top: 50%;
        right: ${({ type }) => (type === 'rangeDate' ? 11 : 0)}px;
        transform: translateY(-50%);
      }
      .ant-picker-clear {
        padding-left: 10px;
      }
    }
  `,

  GlobalStyles: createGlobalStyle`
    .ant-picker-dropdown {
      z-index: 1300 !important;
    }
    .ant-picker {
      border-radius: 5px;
      &.ant-picker-focused {
        box-shadow: none;
      }
    }
    .ant-picker-content {
      .ant-picker-cell-today,
      .ant-picker-cell-selected
       {
         .ant-picker-cell-inner{
          border-radius: 50%;
          &:before{
            border-radius: 50% !important;
          }
         }
      }
    }
  `,
};

export default React.memo(CustomDatePicker);
