import React from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';
import { dashboard_banner } from 'components/base/images';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { color } from 'styles/utils';

function PrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style, display: 'block' }} onClick={onClick}>
      <ChevronLeftIcon fontSize="large" />
    </div>
  );
}

function NextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style, display: 'block' }} onClick={onClick}>
      <ChevronRightIcon fontSize="large" />
    </div>
  );
}

const sliderList = [
  {
    contentUrl: dashboard_banner,
    linkUrl: 'https://www.youtube.com/watch?v=9OmwQd9hU-8',
  },
];

const AdvertisementArea1Slider = ({ data = sliderList }) => {
  // TODO: 실제 url 및 이미지 연동
  const settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // prevArrow: <PrevArrow />,
    // nextArrow: <NextArrow />,
  };

  if (!data?.length) return null;
  return (
    <Styled.AdvertisementArea1Slider data-component-name="AdvertisementArea1Slider" {...settings}>
      {/* <div>
        <img src={dashboard_banner} alt="" />
      </div> */}
      {data.map((item, idx) => (
        <div className="Slider__item" key={idx}>
          <a href={item.linkUrl} target="_blank" rel="noopener noreferrer">
            <img src={item.contentUrl} alt="banner" />
          </a>
        </div>
      ))}
    </Styled.AdvertisementArea1Slider>
  );
};

const Styled = {
  AdvertisementArea1Slider: styled(Slider)`
    .Slider__item {
    }
  `,
};

export default React.memo(AdvertisementArea1Slider);
