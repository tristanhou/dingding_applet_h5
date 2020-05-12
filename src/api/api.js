// const dev = process.env.NODE_ENV === 'development' ? 'proxy' : '';
const dev = 'proxy'

const api = {
    GET_DINGDING_USERID: dev + '/attendance/user/getDingDingUserId', // 获取userid
    GET_DINGDING_USERINFO: dev + '/attendance/user/getDingDingUserInfo', //GET 获取用户数据
    GET_DINGDING_PDT: dev + '/attendance/pdt/selPdt', // 获取 PDT 数据
    GET_DINGDING_PROJECT: dev + '/attendance/project/selProjectByPdtId', // 获取项目数据
    GET_DINGDING_DAILY: dev + '/attendance/daily/addDaily', // 
};

export default api;
