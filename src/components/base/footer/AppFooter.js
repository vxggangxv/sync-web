import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

function AppFooter(props) {
  return (
    <Styled.AppFooter data-component-name="AppFooter">
      <footer className="footer">
        <address className="footer__address">
          {/* <p className="footer__text">
            (주) []
            <br />
            대표자 : []
            <br />
          </p> */}
        </address>
        <small className="footer__copyright"></small>
      </footer>
    </Styled.AppFooter>
  );
}

const Styled = {
  AppFooter: styled.div`
    position: relative;
    .footer {
      text-align: center;
    }
  `,
};

export default AppFooter;
