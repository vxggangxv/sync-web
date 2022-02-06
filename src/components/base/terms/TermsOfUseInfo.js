import React, { useState } from 'react';
import styled from 'styled-components';
import { font, color } from 'styles/utils';
import PlainModal from 'components/common/modal/PlainModal';
import ModalTerms from 'components/common/modal/content/ModalTerms';
import T from 'components/common/text/T';
import { Trans } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { pageUrl } from 'lib/mapper';

export default function TermsOfUseInfo({ location = '', rightFontColor = '' }) {
  const { t } = useTranslation();
  const [modalType, setModalType] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();

  const modalObj = {
    launcher: <ModalTerms type={'launcher'} />,
    process: <ModalTerms type={'process'} />,
    finance: <ModalTerms type={'finance'} />,
    collection: <ModalTerms type={'collection'} />,
    offer: <ModalTerms type={'offer'} />,
  };

  const currentModal = modalObj[modalType] || null;

  return (
    <>
      {currentModal && (
        <PlainModal
          dim={false}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          content={currentModal}
          width={'100%'}
          isCloseIcon={true}
        />
      )}
      <StyledTermsOfUseInfo className="term__singup_info_box" rightFontColor={rightFontColor}>
        {/* <p className="term__info text">
          <T>SIGNUP_ACCEPT_TERMS_CONTENT1</T>
          <span
            className="term__info_link"
            onClick={() => {
              setIsOpen(true);
              setModalType('launcher');
            }}
          >
            <T>SIGNUP_ACCEPT_TERMS_CONTENT2</T>
          </span>{' '}
          <T>SIGNUP_ACCEPT_TERMS_CONTENT3</T>{' '}
          <span
            className="term__info_link"
            onClick={() => {
              setIsOpen(true);
              setModalType('process');
            }}
          >
            <T>SIGNUP_ACCEPT_TERMS_CONTENT4</T>
          </span>{' '}
          <T>SIGNUP_ACCEPT_TERMS_CONTENT5</T>
        </p> */}

        {location == 'signup' && (
          <p className="term__singup_info">
            <Trans
              defaults="SIGNUP_ACCEPT_TERMS_CONTENT"
              components={[
                <span></span>,
                <span
                  className="term__singup_info_link"
                  onClick={() => {
                    window.open(pageUrl.legal.termsOfService);
                  }}
                ></span>,
                <span
                  className="term__singup_info_link"
                  onClick={() => {
                    window.open(pageUrl.legal.privacyPolicy);
                  }}
                ></span>,
              ]}
            />
          </p>
        )}

        {location == 'footer' && (
          <p className="term__footer_info">
            <span
              className="term__footer_info_service underline"
              onClick={() => {
                history.push(pageUrl.legal.termsOfService);
              }}
            >
              <T>TERMS_OF_SERVICE</T>
            </span>
            /
            <span
              className="term__footer_info_policy underline"
              onClick={() => {
                history.push(pageUrl.legal.privacyPolicy);
              }}
            >
              <T>PRIVACY_POLICY</T>
            </span>
          </p>
        )}
      </StyledTermsOfUseInfo>
    </>
  );
}

const StyledTermsOfUseInfo = styled.div`
    /* text-align: center; */
    .term__singup_info {
      ${font(12, color.gray_font)};
      line-height: 18px;
      letter-spacing: 0.2px;
      display: inline-block;

      .term__singup_info_link {
        color: ${color.blue};
        font-weight: 700;
        cursor: pointer;
      }
    }
    .term__footer_info {
      padding-top: 15px;
      /* color: ${color.white}; */
      color: ${({ rightFontColor }) => (!!rightFontColor ? rightFontColor : 'white')};

      .underline {
        text-decoration: underline;
      }
      .term__footer_info_service {
        margin-right: 15px;
        &:hover {
          cursor: pointer;
        }
      }
      .term__footer_info_policy {
        margin-left: 15px;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .link {
      cursor: pointer;
    }
  `,
;

const ModalTerms = ({ type = '' }) => {
  const contentObj = {
    launcher: {
      title: t('POLICY_TERMS_TITLE'),
      content: t('POLICY_TERMS_CONTENT'),
    },
    process: {
      title: t('POLICY_PRIVACY_TITLE'),
      content: t('POLICY_PRIVACY_CONTENT'),
    },
    // TEMP: 사용 X
    finance: {
      title: '전자금융거래이용약관',
      content: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt.`,
    },
    collection: {
      title: '개인정보 수집 및 이용',
      content: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt.`,
    },
    offer: {
      title: '개인정보 제공 내용',
      content: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam possimus, modi, magni neque saepe recusandae, libero aperiam debitis sunt doloribus quis! Eum modi asperiores neque eligendi rerum dolores libero incidunt.`,
    },
  };

  let currentContent = contentObj[type];
  if (!currentContent) {
    currentContent = null;
  }

  return (
    <StyledModalTerms data-component-name="ModalTerms">
      <div className="modalTerms__container">
        <h1 className="title">
          <T>{currentContent.title}</T>
        </h1>
        <p className="content">
          <T>{currentContent.content}</T>
        </p>
      </div>
    </StyledModalTerms>
  );
};

const StyledModalTerms = styled.div`
  position: relative;
  padding: 50px;
  height: 100%;
  .modalTerms__container {
    /* width: 1280px; */
  }
  .title {
    margin-bottom: 20px;
    border-bottom: 1px solid #ececec;
    padding-bottom: 10px;
    ${font(22, color.black_font)};
  }
  .content {
    /* height: 450px; */
    height: 100%;
    overflow-y: auto;
    ${font(14, color.black_font)};
    line-height: 16px;
  }
`;
