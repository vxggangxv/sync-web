import { Grid, Checkbox, TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import useInput from 'lib/hooks/useInput';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';

import MuiButton from 'components/common/button/MuiButton';
import MuiWrapper from 'components/common/input/MuiWrapper';
import T from 'components/common/text/T';
import { employee_add, icon_trash, product_calendar } from 'components/base/images';
import CustomSpan from 'components/common/text/CustomSpan';
import { StyledPlainButtonOuter } from 'components/common/styled/Button';
import CustomText from 'components/common/text/CustomText';
import EmployeeCard from 'components/account/EmployeeCard';
import BarChart from 'components/common/chart/BarChart';
import DonutChart from 'components/common/chart/DonutChart';

interface ProductModalProps {
  // page: object | any;
  // period: object | any;
  // checkedProjectProcess: object | any;
  // keyword: object | any;
}

function ProductModalContainer({}: ProductModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<number | any>();
  // const [selectedProductSerial, setSelectedProductSerial] = useState<string | any>();
  const selectedProductSerial = useInput();
  const handleClickProduct = (index: number) => {
    if (selectedProduct !== index) {
      setSelectedProduct(index);
    } else {
      setSelectedProduct(null);
    }
    console.log('product index _____', index);
    return;
  };

  useEffect(() => {}, [selectedProduct]);
  useEffect(() => {
    console.log('selectedProductSerial ____ ', selectedProductSerial);
  }, [selectedProductSerial]);
  return (
    <StyledProductModal data-component-name="ProductModal">
      <div className="productModal__container">
        <div className="productModal__title_box active">
          <div className="productModal__title_label">
            <CustomSpan fontSize={22} fontWeight={500}>
              1
            </CustomSpan>
          </div>
          <CustomSpan fontSize={20} fontWeight={700} marginLeft={20}>
            <T>Select Product</T>
          </CustomSpan>
        </div>
        <div className="productModal__product_list_box">
          {Array.from({ length: 4 }).map((item: any, index: number) => (
            <div className="productModal__product_box" key={index}>
              <div className="productModal__product"></div>

              <MuiButton
                disableElevation
                className={cx('productModal__product_name', {
                  // active: selectedWarrantyProduct.value === item.productId ? true : false,
                })}
                variant={selectedProduct === index ? 'contained' : 'outlined'}
                onClick={() => handleClickProduct(index)}
              >
                <CustomSpan fontSize={16} fontWeight={500}>
                  Freedom i
                </CustomSpan>
              </MuiButton>
            </div>
          ))}
        </div>
        <div
          className={cx('productModal__title_box', {
            active: !!selectedProduct ? true : false,
          })}
        >
          <div className="productModal__title_label">
            <CustomSpan fontSize={22} fontWeight={500}>
              2
            </CustomSpan>
          </div>
          <CustomSpan fontSize={20} fontWeight={700} marginLeft={20}>
            <T>Enter Serial Number</T>
          </CustomSpan>
        </div>
        <div className="productModal__product_serial_box">
          <p>
            <CustomSpan fontSize={15} fontWeight={500} fontColor="#000000">
              <T>- Serial Number</T>
            </CustomSpan>
          </p>
          <MuiWrapper>
            <TextField
              name="serialNumber"
              type="text"
              disabled={!selectedProduct}
              placeholder="Please enter it"
              inputProps={{
                maxLength: 32,
              }}
              variant="outlined"
              fullWidth
              autoComplete="off"
              value={!!selectedProductSerial.value ? selectedProductSerial.value : ''}
              onChange={e => {
                selectedProductSerial.onChange(e);
              }}
            />
          </MuiWrapper>
        </div>
        <StyledPlainButtonOuter backgroundColor="#0d2194" left="50%" width={370} height={76}>
          <MuiButton
            type="submit"
            config={{
              width: '320px',
            }}
            // disabled={isDataValid}
            disabled={!selectedProductSerial.value}
            disableElevation
            color="primary"
            variant="contained"
            disablebackground="#17288a"
            disablefontcolor="#ffffff"
            className="xl border-radius-round productModal__submit_btn "
          >
            <T>Registration</T>
          </MuiButton>
        </StyledPlainButtonOuter>
      </div>
    </StyledProductModal>
  );
}

const StyledProductModal = styled.section<{}>`
  /* .productModal__container_wrapper {
    padding-bottom: 28px;
    position: relative;
    .productModal__submit_btn {
      border: 1px solid #ffffff;
      position: relative;
    }
  } */
  .productModal__container {
    width: 100%;
    border-radius: 15px;
    padding: 40px 30px 38px;
    background-color: #ffffff;
    position: relative;
    .productModal__submit_btn {
      border: 1px solid #ffffff;
    }
    .productModal__title_box {
      display: inline-flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 20px;
      &.active {
        color: #000000;
        .productModal__title_label {
          width: 40px;
          height: 40px;
          color: #ffffff;
          background-color: #00a4e3;
          border: 2px solid #00a4e3;
          border-radius: 20px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
        }
      }

      color: #b5b7c1;
      .productModal__title_label {
        width: 40px;
        height: 40px;
        color: #b5b7c1;
        background-color: #ffffff;
        border: 2px solid #b5b7c1;
        border-radius: 20px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
      }
    }

    .productModal__product_list_box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 60px;
      /* flex-wrap: wrap; */
      /* column-gap: 10px; */
      .productModal__product_box {
        width: 280px;
        height: 280px;
        border-radius: 10px;
        border: 0.5px solid #00a4e3;
        background-color: #edf4fb;
        position: relative;
        overflow: hidden;
        &:hover {
          background-color: #00a4e3;
          .productModal__product_name {
            color: #ffffff;
          }
        }
        .productModal__product {
          /* width: 280px; */
          width: 100%;
          height: 230px;
          /* border-radius: 10px; */
          border-radius: 0 0 10px 10px;
          background-color: #ffffff;
          border-bottom: 0.5px solid #00a4e3;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 10;
        }
        .productModal__product_name {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 1;
          width: 100%;
          height: 60px;
          padding-top: 10px;
          /* display: flex;
          justify-content: center;
          align-items: center;
          color: #00a4e3; */
          border-radius: 0 0 10px 10px;
          border: none;
        }
      }
    }

    .productModal__product_serial_box {
      padding-left: 60px;
      margin-bottom: 60px;
      p {
        margin-bottom: 5px;
      }
      .productModal__product_serial {
        width: 530px;
      }
    }
  }
`;

export default React.memo(ProductModalContainer);
