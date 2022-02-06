import React from 'react';
import AppTemplate from 'components/base/template/AppTemplate';
import AppNav from 'components/base/nav/AppNav';
import { Route, Redirect, Switch } from 'react-router-dom';
import InvoiceContainer from 'containers/invoice/InvoiceContainer';
import { pageUrl } from 'lib/mapper';
import { useLocation } from 'react-router';

function Invoice() {
  const { pathname } = useLocation();

  return (
    <AppTemplate
      title={'Invoice'}
      leftSide={<AppNav />}
      // mainContainerStyle={{
      //   justifyContent: 'space-between',
      // }}
      mainStyle={{
        padding: '0 50px',
      }}
    >
      <Switch>
        {/* <Redirect exact path={pageUrl.invoice.index} to={pageUrl.invoice.index} /> */}
        <Route exact path={pageUrl.invoice.index} component={InvoiceContainer} />
        <Route component={() => <Redirect to={pageUrl.error.notFound} />} />
      </Switch>
    </AppTemplate>
  );
}

export default Invoice;
