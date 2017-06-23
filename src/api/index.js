import axios from 'axios';

let base = 'http://localhost:8888/'; // @TODO Move this to env-config

export const HTTP = axios.create({
    baseURL: base
})
HTTP.interceptors.request.use(function (config) {
    var user = sessionStorage.getItem('rpp_userdata');
    if(user) {
        config.headers.Authorization = 'Bearer ' + JSON.parse(user).token;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

class Auth {
    login(params) {
        return HTTP.post('/auth/local', params);
    }
}

class RestApi {

    constructor(type) {
        this.type = type;
    }

    get(params) {
        return HTTP.get('/' + this.type, {
            params
        }).then(res => res.data);
    }

    create(data) {
        return HTTP.post('/' + this.type, data).then(res => res.data);
    }

    update(id, data) {
        if(!id) return;
        return HTTP.patch('/' + this.type + '/' + id, data).then(res => res.data);
    }

    delete(id) {
        return HTTP.delete('/' + this.type + '/' + id).then(res => res.data);
    }

}
 
export const auth = new Auth();
export const entriesApi = new RestApi('entries');
export const productApi = new RestApi('product');
export const usersApi = new RestApi('users');
export const vendorsApi = new RestApi('vendors');
export const mailsApi = new RestApi('mails');