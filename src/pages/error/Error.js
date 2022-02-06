import React from 'react';
import { Switch, Route } from 'react-router';
import * as mapper from 'lib/mapper';
import NotFound from 'components/base/error/NotFound';
import ServerError from 'components/base/error/ServerError';

function Error(props) {
  return (
    <>
      <Switch>
        <Route path={`${mapper.pageUrl.error.server}`} component={ServerError} />
        <Route path={`${mapper.pageUrl.error.notFound}`} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default Error;
