import React from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import { Pagination } from '@material-ui/lab';
import { useDidUpdateEffect } from 'lib/utils';
import PropTypes from 'prop-types';

const MuiPagination = props => {
  const { count = 1, page = 1, onChange = () => {}, config = {} } = props;
  let MuiProps = {
    ...props,
  };
  delete MuiProps.config;
  const { alignItems = '', justifyContent = '', style = {} } = config;

  // page클릭시 scroll top
  useDidUpdateEffect(() => {
    // window.scrollTo(0, 0);
  }, [page]);

  return (
    <Styled.MuiPagination
      data-component-name="MuiPagination"
      alignItems={alignItems}
      justifyContent={justifyContent}
      style={style}
      className="muiPagination"
    >
      {/* {children} */}
      <Pagination {...MuiProps} />
    </Styled.MuiPagination>
  );
};

MuiPagination.propsTypes = {
  page: PropTypes.number.isRequired,
};

const Styled = {
  MuiPagination: styled.div`
    display: flex;
    width: 100%;
    align-items: ${({ alignItems }) => !!alignItems && alignItems};
    justify-content: ${({ justifyContent }) => !!justifyContent && justifyContent};
    .MuiPaginationItem-root {
      font-size: 16px;
      color: #333;
    }
    .MuiPaginationItem-page:hover,
    .MuiPaginationItem-page.Mui-selected:hover {
      background-color: #ececec;
    }
    .MuiPaginationItem-page.Mui-selected,
    .MuiPaginationItem-page.Mui-selected.Mui-focusVisible {
      background-color: transparent;
    }
    .MuiPaginationItem-page.Mui-selected {
      color: ${color.blue};
    }
    .MuiPaginationItem-icon {
      font-size: 22px;
    }
  `,
};

export default React.memo(MuiPagination);
