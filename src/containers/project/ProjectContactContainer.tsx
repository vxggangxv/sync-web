import { Grid } from '@material-ui/core';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import { useDidUpdateEffect } from 'lib/utils';
import { color, paper } from 'styles/utils';
import useInput from 'lib/hooks/useInput';
import { ProjectSocketContext } from 'contexts/ProjectSocketContext';
import _ from 'lodash';
import { useLocation, useParams } from 'react-router-dom';
import { cutUrl } from 'lib/library';
import ImgCrop from 'components/common/images/ImgCrop';
import { icon_user_circle } from 'components/base/images';
import queryString from 'query-string';
import ProjectChatContainer from './ProjectChatContainer';
import ProjectHistoryListContainer from './ProjectHistoryListContainer';
// import ProjectHistoryListContainer from 'containers/project/ProjectHistoryListContainer';
import T from 'components/common/text/T';
import { useShallowAppSelector } from 'store/hooks';

// http://localhost:48052/private, http://localhost:48052/project
function ProjectContactContainer() {
  return (
    <Styled.ProjectContactContainer data-component-name="ProjectContactContainer">
      <ProjectChatContainer />

      <ProjectHistoryListContainer />
    </Styled.ProjectContactContainer>
  );
}

export default React.memo(ProjectContactContainer);

const Styled = {
  ProjectContactContainer: styled.div`
    position: relative;
    width: 100%;
  `,
};
