import { Grid, Checkbox, TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';
import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';

import EmployeeContainer from 'containers/account/EmployeeContainer';
import UnitPriceContainer from 'containers/account/UnitPriceContainer';
import SalesPointContainer from 'containers/account/SalesPointContainer';
import WarrantyContainer from 'containers/account/WarrantyContainer';

interface AccountInfoProps {
  // page: object | any;
  // period: object | any;
  // checkedProjectProcess: object | any;
  // keyword: object | any;
}

function AcctounContainer({}: AccountInfoProps) {
  useEffect(() => {
    // init
    console.log('Init ______ [ AcctounContainer ]');
  }, []);

  return (
    <StyledAcctounInfo data-component-name="AcctounInfo">
      <h1 className="sr-only">Account</h1>
      <Grid container className="acctounInfo__sales_unit_wrapper">
        <Grid item className="acctounInfo__content_wrapper sales">
          <SalesPointContainer />
        </Grid>
        <Grid item className="acctounInfo__content_wrapper unit">
          <UnitPriceContainer />
        </Grid>
      </Grid>

      <EmployeeContainer />
      {/* <WarrantyContainer /> */}
    </StyledAcctounInfo>
  );
}

const StyledAcctounInfo = styled.section<{}>`
  padding-bottom: 120px;
  .acctounInfo__sales_unit_wrapper {
    padding-bottom: 40px;
  }
  .acctounInfo__content_wrapper {
    flex-wrap: wrap;
    &.sales {
      width: 466px;
      margin-bottom: 20px;
    }
    &.unit {
      width: 1162px;
      margin-left: -34px;
      margin-bottom: 20px;
    }
  }
`;

export default React.memo(AcctounContainer);
