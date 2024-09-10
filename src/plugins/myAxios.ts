import axios from "axios";
import {showToast} from "vant";

const myAxios = axios.create({
    baseURL: '/api'
})

// 请求拦截器
myAxios.interceptors.request.use(function (config){
    //携带登录态
    const token = sessionStorage.getItem("authorization");
    if(token){
        config.headers.set("authorization", token);
    }

    return config;
}, function(error){
    return Promise.reject(error);
});

// 响应拦截器
myAxios.interceptors.response.use(function(response){

    if(response?.data?.code === 40100){
        //TODO 保存当前页面为路径参数
        //const path = window.location.pathname;

        //跳转到登录页

        setTimeout(() => {
            // useRouter().push('/user/login').then(r => r?.data);
            window.location.href = '/user/login';
        }, 500);
    }
    if(response?.data?.code !== 0){
        showToast(response.data.errorMsg);
    }

    return response?.data;

}, function (error) {
    return Promise.reject(error);
})

export default myAxios;