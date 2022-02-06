import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';

import MuiWrapper from 'components/common/input/MuiWrapper';
import MuiButton from 'components/common/button/MuiButton';
import CustomSpan from 'components/common/text/CustomSpan';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { icon_request_post } from 'components/base/images';
import { ContactsOutlined } from '@material-ui/icons';
import moment from 'moment';
import DateConverter from 'components/common/convert/DateConverter';

// export default function PartnerRequestSlick(props) {
const PartnerRequestSlick = ({
  receiveRequest,
  onClickPartnerRequest = (partner, answer) => {},
}) => {
  const [initSlide, setInitSlide] = useState(0);
  const [counts, setCounts] = useState(1);
  const [nav1, setNav1] = useState([]);
  const [nav2, setNav2] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(-1);
  const [nextIndex, setNextIndex] = useState(1);
  // const [height, setHeight] = useState(150);
  const slickRef = useRef();
  const slickSliderRef = useRef();
  // const contentsLength = 6;
  const contentsLength = receiveRequest?.length;
  const slidesToShowCount =
    contentsLength > 4 ? 5 : contentsLength < 5 && contentsLength > 2 ? 3 : 1;

  let slider1 = [];
  let slider2 = [];

  useEffect(() => {
    setNav1(slider1);
    setNav2(slider2);
  }, []);

  useEffect(() => {
    console.log('receiveRequest _____ ', receiveRequest);
    console.log('receiveRequest _____ ', receiveRequest?.length);
  }, []);

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;

    return (
      <div className={className} onClick={onClick}>
        <MuiButton disableElevation className="arrow_box_wrapper">
          <CustomSpan fontSize={13} fontWeight={200} fontColor="#B5B7C1">
            NEXT
          </CustomSpan>
          <div className="arrow_icon_box next">
            <div className="arrow_icon next"></div>
          </div>
        </MuiButton>
      </div>
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div className={className} onClick={onClick}>
        <MuiButton disableElevation className="arrow_box_wrapper">
          <div className="arrow_icon_box prev">
            <div className="arrow_icon prev"></div>
          </div>
          <CustomSpan fontSize={13} fontWeight={200} fontColor="#B5B7C1">
            BACK
          </CustomSpan>
        </MuiButton>
      </div>
    );
  }

  const handleAfterChangeIndex = index => {
    setPrevIndex(Number(index) - 1);
    setCurrentIndex(index);
    setNextIndex(Number(index) + 1);
    setCounts(index + 1);
  };

  const settings = {
    asNavFor: nav1,
    ref: slider => (slider2 = slider),
    centerMode: true,
    infinite: true,
    dots: false,
    // centerPadding: '142px',
    // centerPadding: '83px',
    centerPadding: '0px',
    slidesToShow: slidesToShowCount,
    speed: 200,
    arrows: false,
    slidesToScroll: 1,
    focusOnSelect: true,
    swipeToSlide: false,
    swipe: false,
    afterChange: index => {
      handleAfterChangeIndex(index);
    },
  };

  const settings2 = {
    asNavFor: nav2,
    ref: slider => (slider1 = slider),
    centerMode: true,
    infinite: true,
    // fade: true,
    dots: false,
    centerPadding: '0px',
    // centerPadding: '60px',
    slidesToShow: 1,
    speed: 0,
    swipe: false,
    swipeToSlide: false,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <StyledPartnerRequestSlick data-component-name="PartnerRequestSlick">
      <div className="partnerRequestSlick__container">
        <div className="partnerRequestSlick__slider_wrapper" ref={slickRef}>
          <StyledCustomSlick
            {...settings}
            prevIndex={prevIndex}
            currentIndex={currentIndex}
            nextIndex={nextIndex}
          >
            {/* {Array.from({ length: contentsLength }).map((item, index) => ( */}
            {/* {receiveRequest?.lenght > 0 && */}
            {receiveRequest.map((item, index) => (
              <div className="slide_item_box" key={index}>
                <div className="slide_item_wrapper">
                  <div className="slide_item">
                    <div>{index + 1}</div>
                  </div>
                </div>
              </div>
            ))}
            {/* {contentsLength > 2 &&
              Array.from({ length: contentsLength }).map((item, index) => ( */}
            {contentsLength > 2 &&
              receiveRequest.map((item, index) => (
                <div className="slide_item_box" key={index}>
                  <div className="slide_item_wrapper">
                    <div className="slide_item">
                      <div>{index + 1}</div>
                    </div>
                  </div>
                </div>
              ))}
          </StyledCustomSlick>

          <StyledCustomSlick2 {...settings2}>
            {receiveRequest.map((item, index) => {
              return (
                <div className="slide_item_info_box_wrapper" key={index}>
                  <div className="slide_item_info_box" key={index}>
                    <CustomSpan fontSize={23} fontWeight={700} fontColor="#303030">
                      {item.name}
                    </CustomSpan>

                    <div>
                      <CustomSpan fontSize={11} fontWeight={400} fontColor="#B5B7C1">
                        <DateConverter timestamp={item.enrollDate} format="YY.MM.DD hh:mm" />
                      </CustomSpan>
                    </div>

                    <CustomSpan fontSize={16} fontWeight={400} fontColor="#303030">
                      has invited you to connect
                    </CustomSpan>

                    <div className="slide_item_count">
                      <img src={icon_request_post} />
                      <CustomSpan
                        fontSize={11}
                        fontWeight={400}
                        marginLeft={10}
                        fontColor="#33B5E4"
                      >
                        {contentsLength > 2
                          ? counts > contentsLength
                            ? counts - contentsLength
                            : counts
                          : counts}
                        {'/'}
                        {contentsLength}
                      </CustomSpan>
                    </div>
                    <div className="slide_item_info_botton_box">
                      <MuiWrapper className="slide_item_info_botton_wrapper">
                        <MuiButton
                          disableElevation
                          className="slide_item_info_botton cancel"
                          variant="contained"
                          color="default"
                          onClick={() => {
                            onClickPartnerRequest(item, 0);
                          }}
                        >
                          <CloseIcon />
                        </MuiButton>
                      </MuiWrapper>
                      <MuiWrapper className="slide_item_info_botton_wrapper">
                        <MuiButton
                          disableElevation
                          className="slide_item_info_botton done"
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            onClickPartnerRequest(item, 1);
                          }}
                        >
                          <DoneIcon />
                        </MuiButton>
                      </MuiWrapper>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* {contentsLength > 2 &&
              Array.from({ length: contentsLength }).map((item, index) => ( */}
            {contentsLength > 2 &&
              receiveRequest.map((item, index) => (
                <div className="slide_item_info_box_wrapper" key={index}>
                  <div className="slide_item_info_box" key={index}>
                    <CustomSpan fontSize={23} fontWeight={700} fontColor="#303030">
                      {item.name}
                    </CustomSpan>

                    <div>
                      <CustomSpan fontSize={11} fontWeight={400} fontColor="#B5B7C1">
                        <DateConverter timestamp={item.enrollDate} format="YY.MM.DD hh:mm" />
                      </CustomSpan>
                    </div>

                    <CustomSpan fontSize={16} fontWeight={400} fontColor="#303030">
                      has invited you to connect
                    </CustomSpan>

                    <div className="slide_item_count">
                      <img src={icon_request_post} alt="icon request post" />
                      <CustomSpan
                        fontSize={11}
                        fontWeight={400}
                        marginLeft={10}
                        fontColor="#33B5E4"
                      >
                        {contentsLength > 2
                          ? counts > contentsLength
                            ? counts - contentsLength
                            : counts
                          : counts}
                        {'/'}
                        {contentsLength}
                      </CustomSpan>
                    </div>
                    <div className="slide_item_info_botton_box">
                      <MuiWrapper className="slide_item_info_botton_wrapper">
                        <MuiButton
                          disableElevation
                          className="slide_item_info_botton cancel"
                          variant="contained"
                          color="default"
                          onClick={() => {
                            onClickPartnerRequest(item, 0);
                          }}
                        >
                          <CloseIcon />
                        </MuiButton>
                      </MuiWrapper>
                      <MuiWrapper className="slide_item_info_botton_wrapper">
                        <MuiButton
                          disableElevation
                          className="slide_item_info_botton done"
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            onClickPartnerRequest(item, 1);
                          }}
                        >
                          <DoneIcon />
                        </MuiButton>
                      </MuiWrapper>
                    </div>
                  </div>
                </div>
              ))}
          </StyledCustomSlick2>
        </div>
      </div>
    </StyledPartnerRequestSlick>
  );
};
const StyledPartnerRequestSlick = styled.section`
  .partnerRequestSlick__container {
    margin: 0 auto;
    width: 410px;

    .partnerRequestSlick__container h3 {
      transition: all 0.3s ease;
    }
  }
`;
const StyledCustomSlick = styled(Slider)`
  .slick-list {
    /* height: 136px; */
    height: 140px;
    margin-bottom: 30px;
  }

  .slick-track {
    .slick-slide {
      .slide_item_box {
        position: initial;
        .slide_item_wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          .slide_item {
            position: absolute;
            z-index: 30;
            top: 0;
            left: 50%;
            transform: translate(-50%, 0);

            display: flex;
            align-items: center;
            justify-content: center;
            width: 85px;
            height: 85px;
            border-radius: 50%;
            background-color: #fbfbfb;
            /* transition-duration: 100ms;
            transition-property: width, height, background-color; */
          }
        }
      }
    }

    div[data-index='${({ prevIndex }) => Number(prevIndex)}'],
    div[data-index='${({ nextIndex }) => Number(nextIndex)}'] {
      .slide_item_box {
        position: initial;
        .slide_item_wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          .slide_item {
            position: absolute;
            z-index: 40;
            top: 0;
            left: 50%;
            transform: translate(-50%, 0);

            display: flex;
            align-items: center;
            justify-content: center;
            width: 105px;
            height: 105px;
            border-radius: 50%;
            background-color: #f1f1f1;
            transition-duration: 100ms;
            transition-property: width, height, background-color;
          }
        }
      }
    }

    div[data-index='${({ currentIndex }) => Number(currentIndex)}'] {
      .slide_item_box {
        position: initial;

        .slide_item_wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          .slide_item {
            position: absolute;
            z-index: 50;
            top: 0;
            left: 50%;
            transform: translate(-50%, 0);

            display: flex;
            align-items: center;
            justify-content: center;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background-color: #e8e8e8;
            transition-duration: 100ms;
            transition-property: width, height, background-color;
            box-shadow: 0px 3px 6px rgb(0 0 0 / 16%);
          }
        }
      }
    }
  }
`;

const StyledCustomSlick2 = styled(Slider)`
  .slide_item_info_botton_box {
    margin-top: 32px;
    .slide_item_info_botton_wrapper {
      height: 70px;
      svg {
        width: 40px;
        height: 40px;
      }
    }

    .slide_item_info_botton {
      width: 65px;
      height: 65px;
      border-radius: 50%;
      color: #ffffff;
      &.cancel {
        margin-right: 30px;
      }
    }
  }
  .slide_item_info_box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    row-gap: 6px;
    .slide_item_count {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .slick-arrow {
    &.slick-next,
    &.slick-prev {
      width: 127px;
      height: 40px;
      border: 1px solid #b5b7c1;
      border-radius: 5px;
      top: 140px !important;
      transform: translate(0, 0);
      z-index: 50;
    }
    &.slick-next {
      right: -28px !important;
    }
    &.slick-prev {
      left: -28px !important;
    }
    &.slick-prev:before,
    &.slick-next:before {
      display: none;
    }

    .arrow_box_wrapper {
      width: 127px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .arrow_icon_box {
        width: 8px;
        height: 8px;
        border-top: 2px solid #b5b7c1;
        border-left: 2px solid #b5b7c1;
        &.prev {
          transform: rotate(-45deg);
        }
        &.next {
          transform: rotate(135deg);
        }
        &:after {
          content: '';
          display: block;
          width: 2px;
          height: 30px;
          background-color: #b5b7c1;
          transform: rotate(-45deg) translate(10px, 3px);
          left: 0;
          top: 0;
        }
      }
    }
  }
`;
export default React.memo(PartnerRequestSlick);
