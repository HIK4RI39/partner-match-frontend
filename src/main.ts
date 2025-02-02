import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import Vant from 'vant';
import 'vant/lib/index.css';
import * as VueRouter from 'vue-router';
import routes from "./config/route.ts";


const router = VueRouter.createRouter({
    //哈希路由
    // history: VueRouter.createWebHashHistory(),
    history: VueRouter.createWebHistory(),
    routes: routes
})

const app = createApp(App);
app.use(Vant);
app.use(router);

app.mount('#app')

