import React from 'react';
import AppTemplate from 'components/base/template/AppTemplate';
import AppNav from 'components/base/nav/AppNav';
import ExcuteNav from 'components/base/nav/ExcuteNav';
import { Route, Redirect, Switch } from 'react-router-dom';
import ProjectListContainer from 'containers/project/ProjectListContainer';
import CreateProjectContainer from 'containers/project/CreateProjectContainer';
import ProjectContainer from 'containers/project/ProjectContainer';
import { pageUrl } from 'lib/mapper';
import { useLocation } from 'react-router';
import { ProjectProvider } from 'contexts/project/ProjectContext';

function Project() {
  const { pathname } = useLocation();

  return (
    <AppTemplate
      title={'Project'}
      leftSide={<AppNav />}
      rightSide={pathname.includes('/project/detail') && <ExcuteNav />}
      mainContainerStyle={{
        justifyContent: 'space-between',
      }}
      mainStyle={{
        padding: '0 50px',
      }}
    >
      <ProjectProvider>
        <Switch>
          <Redirect exact path={pageUrl.project.index} to={pageUrl.project.list} />
          <Route path={pageUrl.project.list} component={ProjectListContainer} />
          <Route path={pageUrl.project.detail} component={ProjectContainer} />
          <Route path={pageUrl.project.create} component={CreateProjectContainer} />
          <Route path={pageUrl.project.edit} component={CreateProjectContainer} />
          <Route component={() => <Redirect to={pageUrl.error.notFound} />} />
        </Switch>
      </ProjectProvider>
    </AppTemplate>
  );
}

export default Project;
