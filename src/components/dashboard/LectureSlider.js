import React from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';
import {
  dashboard_lecture_1,
  dashboard_lecture_2,
  dashboard_lecture_3,
} from 'components/base/images';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { color } from 'styles/utils';

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style, display: 'block' }} onClick={onClick}>
      <ChevronLeftIcon fontSize="large" />
    </div>
  );
}

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style, display: 'block' }} onClick={onClick}>
      <ChevronRightIcon fontSize="large" />
    </div>
  );
}

const sliderList = [
  {
    contentUrl: dashboard_lecture_1,
    linkUrl: 'https://www.youtube.com/watch?v=9OmwQd9hU-8',
  },
  {
    contentUrl: dashboard_lecture_2,
    linkUrl: 'https://www.youtube.com/watch?v=a-jbn_JCElI',
  },
  {
    contentUrl: dashboard_lecture_3,
    linkUrl: 'https://www.youtube.com/watch?v=aInttHr0j_Q',
  },
  {
    contentUrl: dashboard_lecture_3,
    linkUrl: 'https://www.youtube.com/watch?v=aInttHr0j_Q',
  },
];

const LectureSlider = ({ data = sliderList }) => {
  // TODO: 실제 url 및 이미지 연동
  const settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  if (!data?.length) return null;
  return (
    <Styled.LectureSlider data-component-name="LectureSlider" {...settings}>
      {data.map((item, idx) => (
        <div className="lectureSlider__item" key={idx}>
          <a href={item.linkUrl} target="_blank" rel="noopener noreferrer">
            <img
              // src={`https://via.placeholder.com/625x500?text=625x500 slider ${idx + 1}`}
              src={item.contentUrl}
              alt="lecture"
            />
          </a>
        </div>
      ))}
    </Styled.LectureSlider>
  );
};

const Styled = {
  LectureSlider: styled(Slider)`
    .lectureSlider__item {
      > a {
        display: block;
        width: 496px;
        margin: 0 auto;
      }
    }

    .slick-arrow {
      display: flex !important;
      align-items: center;
      justify-content: center;
      z-index: 1;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      &,
      &:hover {
        background: ${color.blue};
        color: white;
      }

      &.slick-prev {
        left: 0px;
        svg {
          margin-left: -3px;
        }
      }
      &.slick-next {
        right: 0px;
        svg {
          margin-right: -3px;
        }
      }
      &:before,
      &:after {
        display: none;
      }
    }
    /* .slick-arrow:before,
    .slick-arrow:after {
      content: '';
    } */
  `,
};

export default React.memo(LectureSlider);
