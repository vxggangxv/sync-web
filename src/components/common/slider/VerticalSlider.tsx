import React, { useEffect } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';
import CustomSpan from 'components/common/text/CustomSpan';
import { color } from 'styles/utils';

// category: "STORE"
// content: "[Update completed] 'ScanApp _IOS' has been updated. Get better service now."
// enrollDate: 1633980498
// language: "EN"
// notificationIdx: 3
// type: "STORAGE"
const dummyData = [
  `[Update] <span style="font-size: 17px; font-weight: 500; font-style: italic; color: #a74ff5">'ScanApp_IOS'</span> has been updated. Get better service now.`,
];

interface Notification {
  category: string;
  content: string;
  enrollDate: number;
  language: string;
  notificationIdx: number;
  type: string;
}

const VerticalSlider = ({ data }: Notification[] | any) => {
  const settings = {
    // dots: true,
    // auoplay
    vertical: true,
    verticalSwiping: true,
    autoplay: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  if (!data?.length) return null;
  return (
    <StyledVerticalSlider data-component-name="VerticalSlider" {...settings}>
      {/* <div className="slider__item" dangerouslySetInnerHTML={{ __html: '하하하' }}></div> */}
      {data.map((item: Notification, idx: number) => {
        const currentContent = item.content;
        const afterSplitWord = currentContent.slice(currentContent.indexOf(`'`) + 1);
        const pointWord = afterSplitWord.slice(0, afterSplitWord.indexOf(`'`));
        // const pointWord = currentContent.slice(
        //   currentContent.indexOf(`'`) + 1,
        //   currentContent.lastIndexOf(`'`),
        // );
        // console.log('content', pointWord);
        const splitList = currentContent.split(`'`);
        const convertedContent = splitList
          .map(splitItem => {
            if (splitItem === pointWord) return `<span>'${splitItem}'</span>`;
            return splitItem;
          })
          .join(' ');
        return (
          <div
            key={idx}
            className="slider__item"
            dangerouslySetInnerHTML={{ __html: convertedContent }}
          ></div>
        );
      })}
    </StyledVerticalSlider>
  );
};

const StyledVerticalSlider = styled(Slider)`
  .slider__item {
    /* height: 17px; */
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    span {
      font-size: 17px;
      font-weight: 500;
      font-style: italic;
      color: #a74ff5;
    }
  }
`;

export default VerticalSlider;
