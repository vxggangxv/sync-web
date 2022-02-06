import { Grid, TextField } from '@material-ui/core';
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
import {
  icon_user_circle,
  icon_app_face,
  icon_app_scan_i,
  icon_app_scan,
  icon_app_match,
  icon_app_smile,
  icon_app_milling,
  icon_app_exocad,
  scan_app_title,
  scan_app_i_title,
  smile_app_title,
  match_app_title,
  base_app_title,
  face_app_title,
  motion_app_title,
  exocad_title,
} from 'components/base/images';
import AppItemCard from 'components/store/AppItemCard';

interface AppItemListProps {
  productList: object | any;
  // page: object | any;
  // period: object | any;
  // checkedProjectProcess: object | any;
  // keyword: object | any;
}

function AppItemCardList({ productList }: AppItemListProps) {
  const [stepFilterOpen, setStepFilterOpen] = useState(false);
  const history = useHistory();
  // const [date, setDate] = useState(null);

  const appItemList = [
    {
      code: 'APP_FACEAPP',
      color: '#F08C00',
      buttonColor: '#F08C00',
      icon: icon_app_face,
      titleImg: face_app_title,
      detail: "Scan the patient's face with \nthe SNAP scanner.",
    },
    {
      code: 'APP_SCAN_MODEL_SCANNER',
      color: '#00A4E3',
      buttonColor: '#00A4E3',
      icon: icon_app_scan_i,
      titleImg: scan_app_i_title,
      detail: 'Connect with the desktop \nscanner to scan stone \nmodel.',
    },
    {
      code: 'APP_SCAN_IOS',
      icon: icon_app_scan,
      color: '#AE52FF',
      buttonColor: '#AE52FF',
      titleImg: scan_app_title,
      installed: 1,
      detail: 'Connect with the FREEDOM i \nscanner to scan oral data.',
    },
    {
      code: 'APP_MATCHAPP',
      color: '#E63462',
      buttonColor: '#E63462',
      icon: icon_app_match,
      titleImg: match_app_title,
      detail: 'Match and align different \nscan data.',
    },
    {
      code: 'APP_SMILEAPP',
      color: '#1CABAE',
      buttonColor: '#1CABAE',
      icon: icon_app_smile,
      titleImg: smile_app_title,
      detail: "nalyzing the patient's facial \ndata and showing the face \nafter treatment.",
    },
    {
      code: 'APP_BASEAPP',
      color: '#09CC78',
      buttonColor: '#09CC78',
      icon: '',
      titleImg: base_app_title,
      detail: 'Create a flat base of the 3D \nscan data for the 3D pinting \nmodel.',
    },
    {
      code: 'APP_EXOCAD',
      color: '#412C7F',
      buttonColor: '#A089E3',
      icon: icon_app_exocad,
      titleImg: exocad_title,
      detail: 'CAD program to design \ndental prosthesis with \n3D data.',
    },
    {
      code: 'APP_MOTIONAPP',
      color: '#17288A',
      buttonColor: '#7989E1',
      icon: icon_app_milling,
      titleImg: motion_app_title,
      detail: 'Control and monitor CRAFT \n5X milling dental prostheses.',
    },
  ];

  useEffect(() => {
    console.log('date', productList);
  }, [productList]);

  return (
    <StyledAppItemCardList data-component-name="AppItemCardList">
      <Grid container className="AppItemCardList__card_list_wrapper">
        {productList?.map((product: any, index: number) => {
          const appItemInfo = appItemList?.find(obj => obj.code === product.productCode);
          return (
            // <Grid item className={cx('AppItemCardList__card_box', item.code)} key={index}></Grid>
            <AppItemCard appItemInfo={appItemInfo} product={product} key={index} />
          );
        })}
      </Grid>
    </StyledAppItemCardList>
  );
}

const StyledAppItemCardList = styled.div<{}>`
  padding: 30px 50px 60px;
  .AppItemCardList__card_list_wrapper {
    column-gap: 18px;
    row-gap: 24px;
    .AppItemCardList__card_box {
      width: 360px;
      height: 300px;
      border-radius: 5xp 5px 15px 15px;
    }
  }
`;

export default React.memo(AppItemCardList);
