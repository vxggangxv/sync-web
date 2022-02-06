import React from 'react';
import styled from 'styled-components';
import ProjectChat from 'components/project/ProjectChat';

interface ProjectChatContainerProps {}

function ProjectChatContainer() {
  return <ProjectChat />;
}

export default React.memo(ProjectChatContainer);
