import { Grid, TextField, FormControlLabel, FormGroup, Radio, RadioGroup } from '@material-ui/core';
import FilterIcon from 'components/base/icons/FilterIcon';
import CustomDatePicker from 'components/common/input/CustomDatePicker';
import MuiWrapper from 'components/common/input/MuiWrapper';
import MuiPagination from 'components/common/pagination/MuiPagination';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import SearchIcon from '@material-ui/icons/Search';
import MuiButton from 'components/common/button/MuiButton';
import AddIcon from '@material-ui/icons/Add';
import { pageUrl, projectProcessFlagList } from 'lib/mapper';
import CheckIcon from 'components/base/icons/CheckIcon';
import { useHistory } from 'react-router-dom';
import CustomSpan from 'components/common/text/CustomSpan';

import { StyledInShadowButtonOuter } from 'components/common/styled/Button';
import useInput from 'lib/hooks/useInput';
import {
  icon_checkbox_checked,
  icon_checkbox_default,
  storage_size_1,
  storage_size_2,
  storage_size_3,
  storage_size_4,
} from 'components/base/images';
import T from 'components/common/text/T';

interface StorageItemListProps {
  productList: object | any;
  // page: object | any;
  // period: object | any;
  // checkedProjectProcess: object | any;
  // keyword: object | any;
}

function StorageItemCardList({ productList }: StorageItemListProps) {
  const [stepFilterOpen, setStepFilterOpen] = useState(false);
  const history = useHistory();
  // const [date, setDate] = useState(null);
  const goods = useInput('');
  const selectedProductObj = useInput({});

  const storageItemList = [
    {
      code: 'CLOUD_5',
      image: storage_size_1,
      detail:
        'Everyone gets 5GB of free Sync \nstorage to start, and it’s easy \nto add more at any time.',
    },
    {
      code: 'CLOUD_50',
      image: storage_size_2,
      detail:
        'Everyone gets 5GB of free Sync \nstorage to start, and it’s easy \nto add more at any time.',
    },
    {
      code: 'CLOUD_200',
      image: storage_size_3,
      detail:
        'Everyone gets 5GB of free Sync \nstorage to start, and it’s easy \nto add more at any time.',
    },
    {
      code: 'CLOUD_2000',
      image: storage_size_4,
      detail:
        'Everyone gets 5GB of free Sync \nstorage to start, and it’s easy \nto add more at any time.',
    },
  ];

  const handleProduct = (e: any) => {
    const value = e.target.value;
    goods.onChange({ value });
    const selected_product = productList?.filter(function (obj: any) {
      return obj.productCode === value;
    })[0];

    selectedProductObj.onChange({ value: selected_product });
  };

  useEffect(() => {
    console.log('product ____ ', selectedProductObj.value);
  }, [selectedProductObj.value]);

  useEffect(() => {
    console.log('date', productList);
  }, [productList]);

  return (
    <StyledStorageItemCardList data-component-name="StorageItemCardList">
      <FormGroup row className="storageItemCardList__card_list_wrapper">
        {productList?.map((product: any, index: number) => {
          const checked = goods.value === product.productCode;
          // const checkIcon = checked ? icon_check_select : icon_check_no;
          const checkIcon = checked ? icon_checkbox_checked : icon_checkbox_default;
          const storageItem = storageItemList.filter(function (obj: any) {
            return obj.code === product.productCode;
          })[0];
          return (
            <label
              className={cx('storageItemCardList__card_wrapper', { active: checked })}
              key={index}
            >
              <div className={cx('storageItemCardList__card_outLine', { active: checked })}></div>
              <input
                type="checkbox"
                className="storageItemCardList__card_input"
                name="goods"
                value={product?.productCode}
                checked={checked}
                onChange={e => {
                  handleProduct(e);
                }}
              />
              <img
                src={checkIcon}
                alt="check icon"
                className="storageItemCardList__card_checkbox"
              />
              <div className="storageItemCardList__card_icon_box">
                <img src={storageItem?.image} />
              </div>

              <div className="storageItemCardList__card_name">{product.productName}</div>
              <div className="storageItemCardList__card_size">
                {product.volume > 999 ? `${product.volume / 1000}TB` : `${product.volume}GB`}
              </div>
              <div className="storageItemCardList__card_detail">{storageItem?.detail}</div>
              <div className="storageItemCardList__card_price_box">
                <div className="storageItemCardList__quarter_circle"></div>
                <div className="storageItemCardList__card_price">{product.price}</div>
              </div>
            </label>
          );
        })}
      </FormGroup>
      <div className="store__button_wrapper">
        <StyledInShadowButtonOuter height={66} width={340}>
          <MuiButton
            config={{
              width: '320px',
              // color: color.blue,
              // iconMarginAlign: 50,
            }}
            disabled={!selectedProductObj.value?.price}
            disableElevation
            variant="contained"
            // onClick={onCreateProject}
            className="xl border-radius-round inset-shadow-default store__button_payment"
            // endIcon={<ChevronRightIcon style={{ fontSize: '34px' }} />}
          >
            <span>
              <T>Payment</T>
            </span>
            {!!selectedProductObj.value.price && (
              <span className="button_price">| {selectedProductObj.value?.price}</span>
            )}
          </MuiButton>
        </StyledInShadowButtonOuter>
      </div>
    </StyledStorageItemCardList>
  );
}

const StyledStorageItemCardList = styled.div<{}>`
  padding: 30px 50px 60px;
  .storageItemCardList__card_list_wrapper {
    display: flex;
    column-gap: 18px;
    .storageItemCardList__card_wrapper {
      position: relative;
      width: 360px;
      height: 400px;
      border-radius: 15px;
      background-color: #00155e;
      padding: 0 30px 30px;
      overflow: hidden;
      &:hover {
        cursor: pointer;
      }

      .storageItemCardList__card_outLine {
        position: absolute;
        background-color: transparent;
        width: 360px;
        height: 400px;
        border: 5px solid #00a4e3;
        display: none;
        left: 0;
        top: 0;
        border-radius: 15px;
        z-index: 10;
        &.active {
          display: block;
        }
      }

      .storageItemCardList__card_input {
        position: absolute;
        top: 0;
        left: 0;
        height: 0;
        width: 0;
        overflow: hidden;
      }
      .storageItemCardList__card_checkbox {
        position: absolute;
        display: block;
        width: 36px;
        height: 36px;
        top: 30px;
        right: 30px;
      }

      .storageItemCardList__card_icon_box {
        display: flex;
        justify-content: center;
        align-items: flex-end;
      }
      .storageItemCardList__card_name {
        font-size: 15px;
        font-weight: 500;
        color: #ffffff;
        margin-bottom: 10px;
      }
      .storageItemCardList__card_size {
        font-size: 28px;
        font-weight: 800;
        color: #33b5e4;
        margin-bottom: 20px;
      }
      .storageItemCardList__card_detail {
        font-size: 14px;
        font-weight: 200;
        color: #b5b7c1;
        line-height: 20px;
        width: 200px;
      }
      .storageItemCardList__card_price_box {
        position: absolute;
        width: 130px;
        height: 130px;
        right: 0;
        bottom: 0;

        .storageItemCardList__quarter_circle {
          width: 130px;
          height: 130px;
          /* margin: 20px; */
          background-color: #042d74;
          border-radius: 130px 0 0 0;
          z-index: 5;
        }
        .storageItemCardList__card_price {
          position: absolute;
          right: 40px;
          bottom: 35px;
          color: #ffffff;
          font-size: 28px;
          font-weight: 400;
        }
      }
    }
  }

  .store__button_wrapper {
    width: 340px;
    height: 66px;
    position: absolute;
    /* left: 50%; */
    right: 50%;
    bottom: 0;
    transform: translate(50%, 0);
    .store__button_payment {
      background: linear-gradient(to right, rgba(0, 166, 266, 1), rgba(8, 123, 238, 1));
      .button_price {
        margin-left: 5px;
        /* border-left: 3px solid #ffffff; */
        padding-left: 5px;
      }
    }
  }
`;

export default React.memo(StorageItemCardList);
