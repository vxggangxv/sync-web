import request from 'api/config/axiosUtils';

export const posts = request({ path: '/todos', config: { timeout: false } });
