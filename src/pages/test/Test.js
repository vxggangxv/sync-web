import React from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { TestList, TestDetail, Counter, TodoApp, DelayedToggle, UserProfile } from 'pages';
import DropzoneWrapper from './DropzoneWrapper';
import NotFound from 'components/base/error/NotFound';
import AppTemplate from 'components/base/template/AppTemplate';
import styled from 'styled-components';
import { color } from 'styles/utils';

function Test({ match }) {
  console.log(match.url, 'match.url');

  // NOTE: match.url 또는 mapper.pageUrl 설정후 path 연결
  return (
    <AppTemplate title={'Test'}>
      <Styled.Test data-component-name="Test">
        <ul className="test__menu_list">
          <li className="test__menu_item">
            <Link to={`${match.url}`}>TestList</Link>
          </li>
          <li className="test__menu_item">
            <Link to={`${match.url}/counter`}>Counter</Link>
          </li>
          <li className="test__menu_item">
            <Link to={`${match.url}/todo`}>Todo</Link>
          </li>
          <li className="test__menu_item">
            <Link to={`${match.url}/delayedToggle`}>DelayedToggle</Link>
          </li>
          <li className="test__menu_item">
            <Link to={`${match.url}/userProfile`}>UserProfile</Link>
          </li>
          <li className="test__menu_item">
            <Link to={`${match.url}/dropzone`}>Dropzone</Link>
          </li>
        </ul>
        <Switch>
          <Route exact path={`${match.url}`} component={TestList} />
          <Route exact path={`${match.url}/@:id`} component={TestDetail} />
          <Route exact path={`${match.url}/counter`} component={Counter} />
          <Route exact path={`${match.url}/todo`} component={TodoApp} />
          <Route exact path={`${match.url}/delayedToggle`} component={DelayedToggle} />
          <Route exact path={`${match.url}/userProfile`} component={UserProfile} />
          <Route exact path={`${match.url}/dropzone`} component={DropzoneWrapper} />
          {/* <Route path={`${match.url}/`} component={() => <Redirect to="/test" />} /> */}
          {/* <Route path={`${match.url}/`} component={() => <div>해당값이 없습니다</div>} /> */}
          <Route component={() => <Redirect to="/error/404" />} />
        </Switch>
      </Styled.Test>
    </AppTemplate>
  );
}

const Styled = {
  Test: styled.div`
    padding: 10px;
    .test__menu_list {
      margin-bottom: 10px;
      .test__menu_item {
        display: inline-flex;
        &:not(:first-child) {
          margin-left: 10px;
        }
      }
    }
  `,
};

export default Test;
