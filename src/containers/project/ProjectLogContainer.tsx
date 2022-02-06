import React from 'react';
import styled from 'styled-components';
import ProjectLog from 'components/project/ProjectLog';

interface ProjectLogContainerProps {}

function ProjectLogContainer() {
  return <ProjectLog />;
}

export default React.memo(ProjectLogContainer);
