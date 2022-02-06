import { navigation } from 'lib/mapper';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';

interface MainHomeProps {}

function MainHome() {
  return (
    <StyledMainHome data-component-name="MainHome">
      <div className="flex-center">MainHome</div>
      <ul className="appNav__menu_list">
        {navigation.map((item, idx) => (
          <li key={idx} className="">
            <NavLink to={item.path} className="appNav__link">
              {item.text}
            </NavLink>
          </li>
        ))}
      </ul>
    </StyledMainHome>
  );
}

const StyledMainHome = styled.div`
  .appNav__menu_list {
    display: flex;
    align-items: center;
    justify-content: center;
    li {
      margin: 20px;
    }
  }
`;

export default React.memo(MainHome);
