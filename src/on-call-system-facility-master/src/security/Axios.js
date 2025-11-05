import axios from 'axios'
// import store from './../store'
// import * as actions from './../store/actions'
import Security from './Security'
// import ToastMe from '../components/common/ToastMe';
const BASE_URL = process.env.REACT_APP_BASE_URL;
// console.log(BASE_URL,"BaseUrl");
function AxiosMiddleware(method, url, data, options) {
    // console.log("AxiosMiddleware");
    // console.log(options?.headers?.env,"options");
    // if(!options?.headers?.env){
    //     data = (new Security()).encrypt(data);

    // }
    if (method!="get" && data.env !== 'test' && url.search("env=test") === -1) {
        // console.log('123');
        data = (new Security()).encrypt(data);
        // console.log(data);
    }
    // console.log(data);
    // return false;
    switch (method) {
        case 'get':
            return axios.get(url, { ...options, params: data });
        case 'post':
            return axios.post(url, data, options);
        case 'head':
            return axios.head(url, data, options);
        case 'patch':
            return axios.patch(url, data, options);
        case 'put':
            return axios.put(url, data, options);
        case 'delete':
            return axios.delete(url, { ...options, params: data });
    }

}
// let token = document.head.querySelector('meta[name="csrf-token"]');
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// axios.defaults.headers['env'] = 'test';

axios.interceptors.response.use(
    (response) => {
        if (response.data.mac !== undefined) {
            response.data = (new Security()).decrypt(response.data);
            // console.log(response.data,"response.data");
        }
        return response
    },
    (error) => {
        switch (error.response.status) {
            case 401:
                // store.dispatch(actions.authLogout())
                break;
            case 404:
                // ToastMe(error.response.data.message, 'danger');
                break;
            default:
                // console.log('error.response.status');
                // console.log(error);
                break;
        }
        return Promise.reject(error);
    }
)

export function get(url, data = [], options = {}) {
    return AxiosMiddleware('get', url, data, options)
}

export function callApi(apiData, data = [], options = {}) {
    const method = apiData[0];
    let url = apiData[1];
    if(url.includes(":id")) url = url.replace(':id',data.id);
    const fullUrl = BASE_URL+url;
    return AxiosMiddleware(method, fullUrl, data, options)
}

