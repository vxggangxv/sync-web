import { Grid, TextField, Icon } from '@material-ui/core';
import T from 'components/common/text/T';
import MuiWrapper from 'components/common/input/MuiWrapper';
import React, { useState } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import MuiButton from 'components/common/button/MuiButton';
import { useHistory } from 'react-router-dom';
import CustomSpan from 'components/common/text/CustomSpan';

import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { freedom_i_title, desktop_scanner_title, cratf_5x_title } from 'components/base/images';

interface WarrantyItemListProps {
  productList: object | any;
  // page: object | any;
  // period: object | any;
  // checkedProjectProcess: object | any;
  // keyword: object | any;
}

function WarrantyItemCardList({ productList }: WarrantyItemListProps) {
  const [stepFilterOpen, setStepFilterOpen] = useState(false);
  const history = useHistory();
  // const [date, setDate] = useState(null);

  // useEffect(() => {
  //   console.log('date', date);
  // }, [date]);

  const warrantyItemList = [
    {
      code: 'WARRANTY_FREEDOM',
      detail: 'Extends the warranty of \nthe oral scanner Freedom i.',
      titleImage: freedom_i_title,
      image: '',
    },
    {
      code: 'WARRANTY_DESKTOP_SCANNER',
      detail: 'Extends the warranty of desktop scanners.',
      titleImage: desktop_scanner_title,
      image: '',
    },
    {
      code: 'WARRANTY_CRAFT5X',
      detail: 'Extends the warranty of \nthe milling machine CRAFT 5X.',
      titleImage: cratf_5x_title,
      image: '',
    },
  ];

  return (
    <StyledWarrantyItemCardList data-component-name="WarrantyItemCardList">
      <Grid container className="warrantyItemCardList__card_list_wrapper">
        {productList?.map((product: any, index: number) => {
          const warrantyItem = warrantyItemList?.find(obj => obj.code === product.productCode);
          return (
            // <Grid item className={cx('AppItemCardList__card_box', item.code)} key={index}></Grid>
            <div className="warrantyItemCardList__card_wrapper">
              <div className="warrantyItemCardList__card_top_container">
                <div className="warrantyItemCardList__card_title_box">
                  <img src={warrantyItem?.titleImage} />
                </div>
                <div className="warrantyItemCardList__card_detail_box">
                  <p>{warrantyItem?.detail}</p>
                </div>
              </div>
              <div className="warrantyItemCardList__card_bottom_container">
                <div className="warrantyItemCardList__card_image_box">
                  {!!warrantyItem?.image && <img src={warrantyItem?.image} />}
                </div>
              </div>
              <div className="warrantyItemCardList__card_download_box">
                <MuiButton
                  disableElevation
                  config={{
                    width: 170,
                    height: 32,
                  }}
                  disabled={!!product?.isInstalled}
                  className={cx('warrantyItemCardList__card_download_btn', {
                    installed: !!product?.isInstalled,
                  })}
                  variant="outlined"
                  color="primary"
                  // onClick={onRead}
                >
                  <SaveAltIcon
                    className={cx('warrantyItemCardList__card_download_icon', {
                      installed: !!product?.isInstalled,
                    })}
                  />
                  <span>
                    <T>Install</T>
                  </span>
                </MuiButton>
              </div>
            </div>
          );
        })}
      </Grid>
    </StyledWarrantyItemCardList>
  );
}

const StyledWarrantyItemCardList = styled.div<{}>`
  padding: 30px 50px 60px;

  .warrantyItemCardList__card_list_wrapper {
    column-gap: 27px;
    .warrantyItemCardList__card_wrapper {
      width: 480px;
      height: 480px;
      border-radius: 15px;
      background-color: #00155e;
      padding: 30px 0 46px 0;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .warrantyItemCardList__card_top_container {
        .warrantyItemCardList__card_title_box {
          width: 100%;
          margin-bottom: 15px;
        }
        .warrantyItemCardList__card_detail_box {
          padding: 0 30px;
          p {
            font-size: 15px;
            font-weight: 400;
            color: #ffffff;
            text-align: center;
            word-break: break-all;
            white-space: break-spaces;
          }
        }
      }

      .warrantyItemCardList__card_bottom_container {
        padding: 0 30px;
        .warrantyItemCardList__card_image_box {
          width: 420px;
          height: 260px;
          background-color: #eff1f8;
          opacity: 0.22;
        }
      }
      .warrantyItemCardList__card_download_box {
        position: absolute;
        bottom: 30px;
        right: 30px;
        .warrantyItemCardList__card_download_btn {
          background-color: #ffffff;
          color: #17288a;
          font-size: 13px;
          font-weight: 500;
          border: none;
          &.installed {
            /* border: 1px solid #b5b7c1; */
            background-color: #a6a8b1;
            color: #cdd0d9;
            font-style: italic;
          }
          .warrantyItemCardList__card_download_icon {
            width: 20px;
            height: 20px;
            margin-right: 5px;
            &.installed {
              display: none;
            }
          }
        }
      }
    }
  }
`;

export default React.memo(WarrantyItemCardList);
