import { Grid, Select, MenuItem, FormControl } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import { megaphone } from 'components/base/images';
import CustomSpan from 'components/common/text/CustomSpan';
import MuiButton from 'components/common/button/MuiButton';
import MuiWrapper from 'components/common/input/MuiWrapper';
import T from 'components/common/text/T';
import { beforeDash, color } from 'styles/utils';
import StorageItemCardList from 'components/store/StorageItemCardList';
import AppItemCardList from 'components/store/AppItemCardList';
import WarrantyItemCardList from 'components/store/WarrantyItemCardList';
import { StyledInShadowButtonOuter } from 'components/common/styled/Button';
import { useShallowAppSelector } from 'store/hooks';
import { StoreActions } from 'store/actionCreators';

// TEST: api data
const testStoreAlarm = [
  {
    idx: 0,
    type: 'storage',
    alarmList: [],
  },
  {
    idx: 1,
    type: 'apps',
    alarmList: [
      {
        content:
          "[업데이트 완료]    ' ScanApp _IOS '가 업데이트가 되었습니다. 더 나은 서비스를 지금 이용해보세요.",
      },
    ],
  },
  {
    idx: 2,
    type: 'warranty',
    alarmList: [],
  },
];
// TEST: api data
const testStoreProducts = [
  {
    idx: 0,
    type: 'storage',
    productList: [
      {
        productIdx: 1,
        productCode: 'CLOUD_5',
        productName: 'Included',
        volume: 5,
        type: 0,
        softwareUrl: 'https://doflab.com',
        detailUrl: 'https://doflab.com',
        duration: 1,
        currencyCode: 'USD',
        price: 10,
      },
      {
        productIdx: 2,
        productCode: 'CLOUD_50',
        productName: 'Most Popular',
        volume: 50,
        type: 0,
        softwareUrl: 'https://doflab.com',
        detailUrl: 'https://doflab.com',
        duration: 1,
        currencyCode: 'USD',
        price: 10,
      },
      {
        productIdx: 3,
        productCode: 'CLOUD_200',
        productName: 'Lots of Data',
        volume: 200,
        type: 0,
        softwareUrl: 'https://doflab.com',
        detailUrl: 'https://doflab.com',
        duration: 1,
        currencyCode: 'USD',
        price: 20,
      },
      {
        productIdx: 4,
        productCode: 'CLOUD_2000',
        productName: 'Great for Network',
        volume: 2000,
        type: 0,
        softwareUrl: 'https://doflab.com',
        detailUrl: 'https://doflab.com',
        duration: 1,
        currencyCode: 'USD',
        price: 100,
      },
    ],
  },
  {
    idx: 1,
    type: 'apps',
    productList: [
      {
        productIdx: 5,
        productCode: 'APP_SCAN_IOS',
        productName: 'IOS',
        volume: null,
        type: 1,
        softwareUrl: 'https://doflab.com',
        detailUrl: 'https://doflab.com',
        currencyCode: 'USD',
        price: 10,
        isInstalled: 0, // 0: 설치 안됨, 1: 설치됨
        isUpdateable: 0, // 0: 업데이트 없음, 1: 업데이트 있음.
      },
      {
        productIdx: 6,
        productCode: 'APP_SCAN_MODEL_SCANNER',
        productName: 'Model Scanner',
        volume: null,
        type: 1,
        softwareUrl: 'https://doflab.com',
        detailUrl: 'https://doflab.com',
        currencyCode: 'USD',
        price: 10,
        isInstalled: 1, // 0: 설치 안됨, 1: 설치됨
        isUpdateable: 0, // 0: 업데이트 없음, 1: 업데이트 있음.
      },
      {
        productIdx: 7,
        productCode: 'APP_FACEAPP',
        productName: '',
        volume: null,
        type: 1,
        softwareUrl: 'https://doflab.com',
        detailUrl: 'https://doflab.com',
        currencyCode: 'USD',
        price: 10,
        isInstalled: 1, // 0: 설치 안됨, 1: 설치됨
        isUpdateable: 0, // 0: 업데이트 없음, 1: 업데이트 있음.
      },
      {
        productIdx: 8,
        productCode: 'APP_SMILEAPP',
        productName: '',
        volume: null,
        type: 1,
        softwareUrl: 'https://doflab.com',
        detailUrl: 'https://doflab.com',
        currencyCode: 'USD',
        price: 10,
        isInstalled: 0, // 0: 설치 안됨, 1: 설치됨
        isUpdateable: 0, // 0: 업데이트 없음, 1: 업데이트 있음.
      },
      {
        productIdx: 9,
        productCode: 'APP_MATCHAPP',
        productName: '',
        volume: null,
        type: 1,
        softwareUrl: 'https://doflab.com',
        detailUrl: 'https://doflab.com',
        currencyCode: 'USD',
        price: 10,
        isInstalled: 0, // 0: 설치 안됨, 1: 설치됨
        isUpdateable: 0, // 0: 업데이트 없음, 1: 업데이트 있음.
      },
      {
        productIdx: 10,
        productCode: 'APP_BASEAPP',
        productName: '',
        volume: null,
        type: 1,
        softwareUrl: 'https://doflab.com',
        detailUrl: 'https://doflab.com',
        currencyCode: 'USD',
        price: 10,
        isInstalled: 0, // 0: 설치 안됨, 1: 설치됨
        isUpdateable: 0, // 0: 업데이트 없음, 1: 업데이트 있음.
      },
      {
        productIdx: 11,
        productCode: 'APP_EXOCAD',
        productName: '',
        volume: null,
        type: 1,
        softwareUrl: 'https://doflab.com',
        detailUrl: 'https://doflab.com',
        currencyCode: 'USD',
        price: 10,
        isInstalled: 0, // 0: 설치 안됨, 1: 설치됨
        isUpdateable: 0, // 0: 업데이트 없음, 1: 업데이트 있음.
      },
      {
        productIdx: 12,
        productCode: 'APP_MOTIONAPP',
        productName: '',
        volume: null,
        type: 1,
        softwareUrl: 'https://doflab.com',
        detailUrl: 'https://doflab.com',
        currencyCode: 'USD',
        price: 10,
        isInstalled: 0, // 0: 설치 안됨, 1: 설치됨
        isUpdateable: 0, // 0: 업데이트 없음, 1: 업데이트 있음.
      },
    ],
  },
  {
    idx: 2,
    type: 'warranty',
    productList: [
      {
        productIdx: 13,
        productCode: 'WARRANTY_FREEDOM',
        productName: ' ',
        volume: null,
        type: 2,
        softwareUrl: 'https://doflab.com',
        detailUrl: 'https://doflab.com',
        duration: 1,
        currencyCode: 'USD',
        price: 10,
        isInstalled: 0, // 0: 설치 안됨, 1: 설치됨
        isUpdateable: 0, // 0: 업데이트 없음, 1: 업데이트 있음.
      },
      {
        productIdx: 14,
        productCode: 'WARRANTY_DESKTOP_COMPUTER',
        productName: ' ',
        volume: null,
        type: 2,
        softwareUrl: 'https://doflab.com',
        detailUrl: 'https://doflab.com',
        duration: 1,
        currencyCode: 'USD',
        price: 10,
        isInstalled: 0, // 0: 설치 안됨, 1: 설치됨
        isUpdateable: 0, // 0: 업데이트 없음, 1: 업데이트 있음.
      },
      {
        productIdx: 15,
        productCode: 'WARRANTY_CRAFT5X',
        productName: ' ',
        volume: null,
        type: 2,
        softwareUrl: 'https://doflab.com',
        detailUrl: 'https://doflab.com',
        duration: 1,
        currencyCode: 'USD',
        price: 10,
        isInstalled: 1, // 0: 설치 안됨, 1: 설치됨
        isUpdateable: 0, // 0: 업데이트 없음, 1: 업데이트 있음.
      },
    ],
  },
];

function StoreContainer() {
  const { fetchStoreProducts, fetchStoreProductSuccess } = useShallowAppSelector(state => ({
    fetchStoreProducts: state.store.storeProducts.data,
    fetchStoreProductSuccess: state.store.storeProducts.success,
  }));
  const history = useHistory();

  const storeProducts = fetchStoreProducts?.productList;
  // const [selectedTab, setSelectedTab] = useState<object | any>();
  const [selectedTabIdx, setSelectedTab] = useState(0);
  // const [productList, setProductList] = useState<object | any>();
  // const productListValue = testStoreProducts.find(item => item.idx === selectedTabIdx)?.productList;
  const productListValue = fetchStoreProducts?.productList;
  const alarmList = testStoreAlarm.find(item => item.idx === selectedTabIdx)?.alarmList;
  // const [alarmList, setAlarmList] = useState<object | any>();

  useEffect(() => {
    // init
    StoreActions.fetch_store_product_list_request({ type: selectedTabIdx, currency: 'KRW' });
  }, []);

  useEffect(() => {
    StoreActions.fetch_store_product_list_request({ type: selectedTabIdx, currency: 'KRW' });
  }, [selectedTabIdx]);
  const storeTabList = useMemo(() => {
    return [
      {
        idx: 0,
        type: 'storage',
        title: 'Sync storage',
        infoTitle: 'The easiest way to share \nthe scan data with your partners.',
        infoDetail:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. \nLorem Ipsum has been the industry's standard dummy text ever since the \n 1500s, when an unknown printer took a galley of type and scrambled it to \nmake a type specimen book. It has survived not only five centuries, but \nalso the leap into electronic typesetting, remaining essentially unchanged.",
        component: <StorageItemCardList productList={productListValue} />,
      },
      {
        idx: 1,
        type: 'apps',
        title: 'Apps',
        infoTitle: 'You’re able to do more with\nyour DOF product than ever before.',
        infoDetail:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. \nLorem Ipsum has been the industry's standard dummy text ever since the \n 1500s, when an unknown printer took a galley of type and scrambled it to \nmake a type specimen book. It has survived not only five centuries, but \nalso the leap into electronic typesetting, remaining essentially unchanged.",
        component: <AppItemCardList productList={productListValue} />,
      },
      {
        idx: 2,
        type: 'warranty',
        title: 'Warranty',
        infoTitle: 'One stop for technical support, DOF \nhardware service, and software support.',
        infoDetail:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. \nLorem Ipsum has been the industry's standard dummy text ever since the \n 1500s, when an unknown printer took a galley of type and scrambled it to \nmake a type specimen book. It has survived not only five centuries, but \nalso the leap into electronic typesetting, remaining essentially unchanged.",
        component: <WarrantyItemCardList productList={productListValue} />,
      },
    ];
  }, [productListValue]);

  const handleClickStoreTab = (index: number) => {
    setSelectedTab(index);
    // Tab 별 Product List API호출
  };

  useEffect(() => {
    // container init
    // 0번(storage) Tab Alarm, Product List 호출
  }, []);

  return (
    <StyledStore data-component-name="Store" paddingBottom={selectedTabIdx === 0}>
      <h1 className="sr-only">Store</h1>

      <div className="store__tabs_wrapper">
        {storeTabList.map((item: any, index: number) => {
          return (
            <MuiWrapper className="store__tabs_btn_wrapper" key={index}>
              <MuiButton
                config={{
                  width: '200px',
                  height: '45px',
                }}
                name={item.type}
                disableElevation
                className={cx('store__tabs_btn', {
                  selected: selectedTabIdx === item.idx,
                })}
                variant="outlined"
                onClick={() => {
                  handleClickStoreTab(item.idx);
                }}
                // onClick={handleClickStoreTab}
              >
                <CustomSpan fontSize={20} fontWeight={400}>
                  {item.title}
                </CustomSpan>
              </MuiButton>
            </MuiWrapper>
          );
        })}
      </div>

      <div className="store__container">
        {!!alarmList?.length && alarmList?.length > 0 && (
          <div className="store__alarm_wrapper">
            <Grid container className="store__alarm_container">
              <Grid item className="store__alarm_icon_box">
                <div className="store__alarm_icon">
                  <img src={megaphone} />
                </div>
              </Grid>
              <Grid item className="store__alarm_text_box">
                <p>
                  [업데이트 완료] ' ScanApp _IOS '가 업데이트가 되었습니다. 더 나은 서비스를 지금
                  이용해보세요.
                </p>
              </Grid>
            </Grid>
          </div>
        )}
        <div className="store__info_wrapper">
          <Grid container className="store__info_container">
            <Grid item className="store__info_detail_box">
              <p className="store__info_detail_title">{storeTabList[selectedTabIdx].title}</p>
              <p className="store__info_detail_infoTitle">
                {storeTabList[selectedTabIdx].infoTitle}
              </p>
              <p className="store__info_detail_infoDetail">
                {storeTabList[selectedTabIdx].infoDetail}
              </p>
            </Grid>
            <Grid container item className="store__info_advertisement_box">
              <Grid item className="store__info_advertisement_item_box"></Grid>
              <Grid item className="store__info_advertisement_item_box"></Grid>
              <Grid item className="store__info_advertisement_item_box"></Grid>
              <Grid item className="store__info_advertisement_item_box"></Grid>
            </Grid>
          </Grid>
        </div>
        <div className="store__list_wrapper">
          <div className="store__list_title">
            <T>[List]</T> {storeTabList[selectedTabIdx].title}
          </div>
          {storeTabList[selectedTabIdx].component}
        </div>
      </div>
    </StyledStore>
  );
}

const StyledStore = styled.section<{ paddingBottom: boolean }>`
  /* padding-bottom: 120px; */
  // Storage 인 경우
  padding-bottom: ${({ paddingBottom }) => (paddingBottom ? '158px' : '120px')};

  .store__tabs_wrapper {
    margin-bottom: 30px;
    .store__tabs_btn_wrapper {
      height: 45px;

      margin-right: 10px;
      .store__tabs_btn {
        text-transform: none;
        color: #b5b7c1;
        &.selected {
          border: none;
          background: linear-gradient(to right, rgba(0, 166, 266, 1), rgba(8, 123, 238, 1));
          color: #ffffff;
        }
      }
    }
  }

  .store__container {
    position: relative;
    width: 100%;
    box-shadow: 0px 0px 10px rgb(0 0 0 / 16%);
    border-radius: 15px;
    /* padding-bottom: 38px; */
    padding-bottom: ${({ paddingBottom }) => paddingBottom && '38px'};
    /* padding: 0 50px 50px; */
  }
  .store__alarm_wrapper {
    width: 100%;
    padding: 30px 50px 20px;
    .store__alarm_container {
      border-radius: 40px;
      background-color: #edf4fb;
      width: 100%;
      padding: 25px 0;
      .store__alarm_icon_box {
        width: 135px;
        position: relative;

        .store__alarm_icon {
          position: absolute;
          left: 0;
          bottom: -25px;
          img {
            width: 135px;
            height: 110px;
          }
        }
      }
      .store__alarm_text_box {
        p {
          line-height: 28px;
        }
      }
    }
  }
  .store__info_wrapper {
    padding: 50px 50px 80px;
    .store__info_detail_box {
      width: calc(100% - 950px);
      .store__info_detail_title {
        margin-bottom: 30px;
        font-size: 32px;
        font-weight: 800;
        color: #00a4e3;
      }
      .store__info_detail_infoTitle {
        margin-bottom: 45px;
        width: 350px;
        font-size: 23px;
        font-weight: 800;
        line-height: 38px;
        color: #303030;
      }
      .store__info_detail_infoDetail {
        width: 470px;
        font-size: 14px;
        font-weight: 200;
        line-height: 25px;
        color: #b5b7c1;
      }
    }
    .store__info_advertisement_box {
      width: 950px;
      height: 490px;
      row-gap: 30px;
      column-gap: 30px;
      .store__info_advertisement_item_box {
        height: 230px;
        background-color: #edf4fb;
        border-radius: 5px;
        &:nth-child(odd) {
          width: 400px;
        }
        width: 520px;
        /* &:nth-child(evne) {
        } */
      }
    }
  }
  .store__list_wrapper {
    .store__list_title {
      font-size: 21px;
      font-weight: 800;
      color: #17288a;
      ${beforeDash({ backgroundColor: color.navy_blue })};
    }
  }
`;

export default React.memo(StoreContainer);
