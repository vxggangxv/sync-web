import React, { useCallback, useEffect, useRef, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import CircularLoading from 'components/base/loading/CircularLoading';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { debounce, throttle } from 'lodash';
import styled from 'styled-components';
import { color } from 'styles/utils';
import InfiniteScroll from 'react-infinite-scroll-component';

// 차후 필요시 multi select 추가
const AsyncFetchSelect = props => {
  const config = { ...props };
  let {
    inputProps,
    //
    className = '',
    minWidth,
    fullWidth,
    width,
    height,
    fontColor,
    placeholderColor,
    fontSize,
    borderColor,
    hoverBorderColor,
    activeBorderColor,
    bgColor,
    // hoverBgColor,
    loadingIconColor = color.blue,
    dropIconColor = '#707070',
    drondownHeight = '100px',
  } = config;
  delete config.inputProps;
  const {
    // value = '',
    // setValue = () => {},
    fetchType = 'search', // search, fetch
    placeholder = '',
    defaultValue = '',
    selectedValue = '',
    setSelectedValue = () => {},
    //
    data = [],
    hasMoreData = false,
    idKey = '',
    labelKey = '',
    exceptId = '',
    onFetch = () => {},
    searchLoading = null,
    onSearch = () => {},
  } = inputProps;

  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState(defaultValue);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [open, setOpen] = useState(null);
  const [cancelShow, setCancelShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // TODO: replace onSearch
  const handleFindKeyword = () => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
        setLoading(false);
      }, 1500);
    });
  };

  // if select, onChange
  const onChangeInput = value => {
    setInputValue(value);
    if (fetchType === 'search') onSearch(value);
  };

  // onChange
  const handleChangeInput = throttle(e => {
    onChangeInput(e.target.value);
    if (!!e.target.value) {
      setCancelShow(true);
    } else {
      setCancelShow(false);
    }
  }, 500);

  const handleFocusInput = e => {
    if (!!e.target.value) setCancelShow(true);
  };

  const handleCancel = () => {
    onChangeInput('');
    setSelectedValue('');
    setSelectedLabel('');
    inputRef.current.focus();
    setCancelShow(false);
  };

  const handleToggleDrop = () => {
    setOpen(!open);
  };

  const handleSelect = value => {
    const { e, id } = value;
    // console.log('handleSelect e', e);
    // focus first!
    inputRef.current.focus();
    // 선택 시점 데이터를 기준으로 selectedLabel 설정
    const currentItem = data.find(item => item[idKey] === id);
    const currentName = !!currentItem ? currentItem[labelKey] : '';
    setSelectedLabel(currentName);
    //
    // 같은 거 선택 안할 경우 실행
    if (selectedValue !== id) {
      onChangeInput(e.target.innerText);
      setSelectedValue(id);
    }
    //
    setOpen(false);
    setCancelShow(true);
  };

  const handleBlurSelect = e => {
    const currentTarget = e.currentTarget;
    // console.log('handleBlurSelect', handleBlurSelect);
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        if (!selectedValue && inputValue) {
          // 선택안한 상태, 검색하다 밖 클릭 -> 초기화
          onChangeInput('');
        }
        if (selectedLabel && inputValue && inputValue !== selectedLabel) {
          // 선택한 이후, 추가 단어 입력 하다가 밖 클릭 -> 검색이 됐던 단어로
          onChangeInput(selectedLabel);
        }

        setOpen(false);
        setCancelShow(false);
      }
    }, 0);
  };

  // SECTION: DidMount

  // 기본값 적용
  useEffect(() => {
    if (data?.length && defaultValue) {
      const currentItem = data.find(item => item[idKey] === defaultValue);
      const currentName = !!currentItem ? currentItem[labelKey] : '';

      onChangeInput(currentName);
      setSelectedValue(defaultValue);
    }
  }, [data, defaultValue]);

  // TEST:
  // useEffect(() => {
  //   console.log('selectedLabel', selectedLabel);
  // }, [selectedLabel]);

  return (
    <StyledAsyncFetchSelect
      data-component-name="AsyncFetchSelect"
      {...config}
      // {...inputProps}
      className={`asyncFetchSelect ${className}`}
      tabIndex="1"
      onBlur={handleBlurSelect}
    >
      <input
        type="text"
        ref={inputRef}
        readOnly={fetchType === 'fetch'}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChangeInput}
        onFocus={handleFocusInput}
        onClick={handleToggleDrop}
        className="AsyncFetchSelect__input"
      />

      {searchLoading && (
        <span className="AsyncFetchSelect__loading">
          <CircularLoading size={13} color={loadingIconColor} />
        </span>
      )}

      {fetchType === 'search' && cancelShow && (
        <button className="AsyncFetchSelect__cancel" onClick={handleCancel}>
          <ClearIcon fontSize="inherit" htmlColor={dropIconColor} />
        </button>
      )}

      <button className="AsyncFetchSelect__drop" onClick={handleToggleDrop}>
        {!open ? (
          <ArrowDropDownIcon fontSize="inherit" htmlColor={dropIconColor} />
        ) : (
          <ArrowDropUpIcon fontSize="inherit" htmlColor={dropIconColor} />
        )}
      </button>

      {open && (
        <div className="AsyncFetchSelect__dropdown_box">
          <InfiniteScroll
            className="infinite-scroll-box"
            dataLength={data?.length}
            next={onFetch}
            hasMore={hasMoreData}
            // next={() => {}}
            // hasMore={true}
            loader={
              <div className="infinite-scroll-loading">
                <CircularLoading />
              </div>
            }
            scrollThreshold={0}
            height={drondownHeight}
          >
            {/* <div
              className="AsyncFetchSelect__dropdown_menu_item"
              onClick={e => handleSelect({ e, id: '' })}
            >
              All
            </div> */}
            {!!data?.length &&
              data.map((item, idx) => {
                if (exceptId && item[idKey] === exceptId) return;

                return (
                  <div
                    key={idx}
                    className="AsyncFetchSelect__dropdown_menu_item"
                    onClick={e => handleSelect({ e, id: item[idKey] })}
                  >
                    {item[labelKey]}
                  </div>
                );
              })}
            {/* {Array.from({ length: 15 }).map((item, idx) => (
              <div
                key={idx}
                className="AsyncFetchSelect__dropdown_menu_item"
                onClick={handleSelect}
              >
                {idx}
              </div>
            ))} */}
          </InfiniteScroll>
        </div>
      )}
    </StyledAsyncFetchSelect>
  );
};

const StyledAsyncFetchSelect = styled.div`
  display: inline-flex;
  align-items: center;
  position: relative;
  min-width: ${({ minWidth }) => minWidth && minWidth};
  width: ${({ fullWidth }) => fullWidth && `100%`};
  width: ${({ width }) => width};
  // height apply, default height: 40px
  height: ${({ height }) => (height ? height : '40px')};
  color: ${({ fontColor }) => (fontColor ? fontColor : '#333')};
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '14px')};
  text-align: initial;
  input,
  button {
    all: unset;
  }
  &.xs {
    height: 24px;
    font-size: 12px;
    .AsyncFetchSelect__dropdown_box {
      top: 23px;
    }
  }
  &.sm {
    height: 32px;
    font-size: 12px;
    .AsyncFetchSelect__dropdown_box {
      top: 31px;
    }
  }
  &.md {
    height: 40px;
    font-size: 14px;
    .AsyncFetchSelect__dropdown_box {
      top: 39px;
    }
  }
  &.lg {
    height: 46px;
    font-size: 16px;
    .AsyncFetchSelect__dropdown_box {
      top: 45px;
    }
  }
  &.xl {
    height: 56px;
    font-size: 16px;
    .AsyncFetchSelect__dropdown_box {
      top: 55px;
    }
  }
  .AsyncFetchSelect__input {
    width: 100%;
    height: 100%;
    padding: 0 8px;
    padding-right: 55px;
    background-color: ${({ bgColor }) => (bgColor ? bgColor : '#fff')};
    border: 1px solid rgba(0, 0, 0, 0.23);
    border-color: ${({ borderColor }) => borderColor};
    border-radius: 4px;
    &:hover {
      border-color: rgba(0, 0, 0, 0.87);
      border-color: ${({ hoverBorderColor }) => hoverBorderColor};
    }
    &:focus {
      border-color: ${color.blue};
      border-color: ${({ activeBorderColor }) => activeBorderColor};
    }
    &::placeholder {
      color: ${({ placeholderColor }) => placeholderColor || `rgba(0, 0, 0, 0.54)`};
    }
  }
  .AsyncFetchSelect__dropdown_box {
    z-index: 10;
    position: absolute;
    top: 39px;
    left: 0;
    width: 100%;
    padding: 5px 0;
    max-height: ${({ drondownHeight }) => drondownHeight};
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.23);
    border-radius: 4px;
    /* box-shadow: inset 0px 0px 6px rgba(0, 0, 0, 0.16); */
    box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%),
      0px 3px 14px 2px rgb(0 0 0 / 12%);

    overflow-y: overlay;
    color: ${color.black_font};
    .AsyncFetchSelect__dropdown_menu_item {
      width: 100%;
      padding: 10px 8px;
      cursor: pointer;
      &:hover {
        background-color: #ebebeb;
      }
    }
  }

  .AsyncFetchSelect__drop,
  .AsyncFetchSelect__cancel,
  .AsyncFetchSelect__loading {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .AsyncFetchSelect__loading {
    right: 58px;
  }
  .AsyncFetchSelect__cancel,
  .AsyncFetchSelect__drop {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    cursor: pointer;
    &:hover {
      background-color: rgb(245, 245, 245, 0.23);
    }
  }
  .AsyncFetchSelect__cancel {
    right: 29px;
    font-size: 18px;
  }
  .AsyncFetchSelect__drop {
    right: 6px;
    font-size: 23px;
  }
`;

export default React.memo(AsyncFetchSelect);
