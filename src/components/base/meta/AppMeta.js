import React from 'react';
import Helmet from 'react-helmet';

// TODO: 차후에 mapper로 이동
const locales = {
  en: 'en_US',
  ko: 'ko_KR',
};

function AppMeta(props) {
  // NOTE: 차후 설정된 값으로 변경
  const siteName = 'DOF Sync';
  const lang = locales[props.locale] || locales['ko'];
  const title = `${props.title} | DOF Sync` || siteName;
  const description = props.description || 'Description';
  // const image = props.image !== undefined && `${props.image}`;
  const image = props.image || null;
  // const favicon = props.favicon || null;
  // const touchIcon = props.touchIcon || null;
  const canonical = props.canonical || null;
  const type = props.type || 'website';

  return (
    <>
      <Helmet>
        <html lang={lang} />
        <title>{title}</title>
        <meta name="description" content={description} />
        {canonical && <link rel="canonical" href={canonical} />}
        {/* public폴더에서 */}
        {/* {image && <link rel="image_src" href={image} />}
        {favicon && <link rel="shortcut icon" href={favicon} />}
        {touchIcon && <link rel="apple-touch-icon" href={touchIcon} />} */}

        {/* facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:title" content={title} />
        {description && <meta property="og:description" content={description} />}
        {image && <meta property="og:image" content={image} />}
        {canonical && <meta property="og:url" content={canonical} />}
        {/* 
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content={locales[lang]} />
        <meta property="fb:pages" content={siteName} />
        <meta property="fb:app_id" content={} />
         */}

        {/* twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        {description && <meta name="twitter:description" content={description} />}
        {image && <meta name="twitter:image" content={image} />}
        {canonical && <meta property="twitter:url" content={canonical} />}
        {/* 
        <meta name="twitter:site" content="@트위터아이디" />
        <meta name="twitter:creator" content="@트위터아이디" />
         */}
      </Helmet>
    </>
  );
}

export default AppMeta;
