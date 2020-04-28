import axios from '@/libs/api.request';
import qs from 'qs';
const http = {
    get (url, data) {
        return axios.request({
            url: url,
            method: 'get',
            params: data
        });
    },
    
    post (url, data) {
        return axios.request({
            url: url,
            method: 'post',
            data: qs.stringify(data)
        });
    }
};
export default http;