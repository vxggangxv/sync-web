import React from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';

export const NewsSlider = React.memo(props => {
  // TODO: 실제 url 및 이미지 연동
  const settings = {
    dots: false,
    // infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Styled.NewsSlider data-component-name="NewsSlider" {...settings}>
      {Array.from({ length: 5 }).map((_, idx) => (
        <div className="newsSlider__item" key={idx}>
          <a href="http://google.com" target="_blank" rel="noopener noreferrer">
            <img
              src={`https://via.placeholder.com/625x500?text=625x500 slider ${idx + 1}`}
              alt="news"
            />
          </a>
        </div>
      ))}
    </Styled.NewsSlider>
  );
});

const Styled = {
  NewsSlider: styled(Slider)`
    width: calc(625px * 2 + 30px * 2);
    @media (max-width: 1280px) {
      width: calc(625px + 30px);
    }
  `,
};

export default NewsSlider;
