import { Grid, TextField, Input } from '@material-ui/core';
import FilterIcon from 'components/base/icons/FilterIcon';
import CustomDatePicker from 'components/common/input/CustomDatePicker';
import MuiWrapper from 'components/common/input/MuiWrapper';
import MuiPagination from 'components/common/pagination/MuiPagination';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { addCommas, removeCommas } from 'lib/library';
import { color } from 'styles/utils';
import cx from 'classnames';
import SearchIcon from '@material-ui/icons/Search';
import MuiButton from 'components/common/button/MuiButton';
import AddIcon from '@material-ui/icons/Add';
import { pageUrl, projectProcessFlagList } from 'lib/mapper';
import CheckIcon from 'components/base/icons/CheckIcon';
import { useHistory } from 'react-router-dom';
import CustomSpan from 'components/common/text/CustomSpan';
import { icon_user_circle } from 'components/base/images';
import useInput from 'lib/hooks/useInput';
import { replace } from 'lodash';
import { useDidUpdateEffect } from 'lib/utils';

interface UnitPriceProps {
  isModify: boolean;
  unitKey: string;
  unitPrice: any;
  implantId: number;
  implantType: string;
  unitPriceCode: string;

  onChangePrice: (unitKey: string, price: number) => void;
  // page: object | any;
  // period: object | any;
  // checkedProjectProcess: object | any;
  // keyword: object | any;
}

function ImplantPriceRow({
  unitKey,
  unitPrice,
  implantType,
  isModify,
  implantId,
  unitPriceCode,
  onChangePrice,
}: UnitPriceProps) {
  const [stepFilterOpen, setStepFilterOpen] = useState(false);
  const history = useHistory();
  // const [date, setDate] = useState(null);

  const price = useInput(0);

  const priceRef = useRef<null | any>(null);
  const prevPrice = useInput(0);

  useEffect(() => {
    price.setValue(unitPrice);
  }, [unitPrice, isModify]);

  useEffect(() => {
    // prevPrice.setValue(unitPrice);
  }, []);

  useEffect(() => {
    if (!!unitPriceCode && unitPriceCode === unitKey) {
      priceRef.current.focus();
    }
  }, []);

  return (
    <StyledImplantPriceRow data-component-name="ImplantPriceRow">
      <Grid container item className="implantPriceRow__wrapper">
        <Grid item className="implantPriceRow__implant_type">
          <CustomSpan marginLeft={20} marginRight={5}>
            &#8735;
          </CustomSpan>
          {implantType}
        </Grid>
        <Grid item className="implantPriceRow__implant_price">
          {isModify ? (
            <input
              className="implant_price radius-md"
              type="text"
              // disabled={true}
              ref={priceRef}
              name={unitKey}
              placeholder="0"
              // value={price.value ? addCommas(price.value) : 0}
              value={addCommas(price.value) || 0}
              onChange={e => {
                const removeCommaToNum = Number(removeCommas(e.target.value));
                if (!isNaN(removeCommaToNum)) {
                  price.onChange({ value: removeCommaToNum });
                  onChangePrice(e.target.name, removeCommaToNum);
                }
              }}
            />
          ) : (
            // <span>{!!price.value ? addCommas(price.value) : '0'}</span>
            <span>{addCommas(price.value) || '0'}</span>
          )}
        </Grid>
      </Grid>
    </StyledImplantPriceRow>
  );
}

const StyledImplantPriceRow = styled.div<{}>`
  .implantPriceRow__wrapper {
    font-size: 12px;
    font-weight: 400;
    color: #7b7d8b;
    justify-content: space-between;
    align-items: center;
    height: 24px;
    .implantPriceRow__implant_type {
      display: flex;
      align-items: center;
    }
    .implantPriceRow__implant_price {
      display: flex;
      align-items: center;
      margin-right: 55px;
      input {
        padding: 0 10px;
      }
      input[type='number']::-webkit-outer-spin-button,
      input[type='number']::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      .implant_price {
        text-align: right;
        border: 1px solid #b5b7c1;
        width: 120px;
        height: 24px;
        border-radius: 3px;
        &:focus {
          border: 1px solid ${color.blue};
        }
      }
    }
  }
`;

export default React.memo(ImplantPriceRow);
