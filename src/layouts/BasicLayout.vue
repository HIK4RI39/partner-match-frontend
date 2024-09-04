<template>
  <div>
    <van-nav-bar
        :title=title
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
    >
      <template #right>
        <van-icon name="search" size="18"/>
      </template>
    </van-nav-bar>


    <div id="content">
      <!--占位符-->
      <router-view></router-view>
    </div>


    <van-tabbar route v-model="active" >
      <van-tabbar-item icon="home-o" name="index" replace to="/">主页</van-tabbar-item>
      <van-tabbar-item icon="search" name="team" replace to="/team">队伍</van-tabbar-item>
      <van-tabbar-item icon="friends-o" name="user" replace to="/user">个人</van-tabbar-item>
    </van-tabbar>

  </div>

</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router'
import routes from "../config/route.ts";
const router = useRouter()

const onClickLeft = () => history.back();
const onClickRight = () => router.push('/search');
const active = ref('index');

const DEFAULT_TITLE = '伙伴匹配';
const title = ref(DEFAULT_TITLE);

//监听路由变化, 动态显示标题
router.beforeEach((to,from,next)=>{//beforeEach是router的钩子函数，在进入路由前执行
  const toPath = to.path;

  const route = routes.find((route) => {
    return toPath == route.path;
  })

  title.value = route?.title ?? DEFAULT_TITLE;

  next()  //执行进入路由，如果不写就不会进入目标页
})

</script>

<style scoped>

</style>