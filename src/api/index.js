import axios from 'axios';

let base = 'http://localhost:8888/';

class Api {

    constructor() {
        this.makeAxiosInstance();
    }

    makeAxiosInstance(token) {
        let cfg = {
            baseURL: base
        }
        if(typeof token !== 'undefined') {
            cfg.headers = {
                Authorization: 'Bearer ' + token
            }
        }
        this.HTTP = axios.create(cfg);
    }

    auth(params) {
        return this.HTTP.post('/auth/local', params);
    }

    getEntries(params) {
        return this.HTTP.get('/entries', params);
    }

    setEntry(data) {
        return this.HTTP.post('/entries', data).then(res => res.data);
    }

    editEntry(id, data) {
        if(!id) return;
        return this.HTTP.patch('/entries', data).then(res => res.data);
    }

    deleteEntry(data) {
        return this.HTTP.delete('/entries', data).then(res => res.data);
    }

}
 
const api = new Api();
export default api;


// export const auth = params => { return HTTP.post(`${base}/auth/local`, params).then(res => res.data); };
/*
export const getUserList = params => { return HTTP.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return HTTP.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return HTTP.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return HTTP.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return HTTP.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return HTTP.get(`${base}/user/add`, { params: params }); };*/