import axios from 'axios';
// import { Actions } from 'store/actionCreators';

export function testApi() {
  const apiAddress = "https://jsonplaceholder.typicode.com/todos/1";
  return axios.get(apiAddress)
}