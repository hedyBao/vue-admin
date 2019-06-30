import axios from 'axios';

let base = 'http://localhost:8080';


//export const addUser = params => { return axios.post(`${base}/addUser`, params).then(res => res.data); };


export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.post(`${base}/user/edit`,  params ); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

export const queryAllRoles = params => { return axios.get(`${base}/role/all`, { params: params }); };




export const getRoleListPage = params => { return axios.get(`${base}/role/listpage`, { params: params }); };

export const queryAllPermissions = params => { return axios.get(`${base}/per/all`, { params: params }); };

export const removeRole = params => { return axios.get(`${base}/role/remove`, { params: params }); };

export const batchRemoveRole = params => { return axios.get(`${base}/role/batchremove`, { params: params }); };

export const editRole = params => { return axios.post(`${base}/role/edit`,  params ); };

export const addRole = params => { return axios.get(`${base}/role/add`, { params: params }); };



export const getPermissionListPage = params => { return axios.get(`${base}/per/listpage`, { params: params }); };

export const queryAll = params => { return axios.get(`${base}/permission/all`, { params: params }); };

export const removePermission = params => { return axios.get(`${base}/per/remove`, { params: params }); };

export const batchRemovePermission = params => { return axios.get(`${base}/per/batchremove`, { params: params }); };

export const editPermission = params => { return axios.post(`${base}/per/edit`,  params ); };

export const addPermission = params => { return axios.get(`${base}/per/add`, { params: params }); };

