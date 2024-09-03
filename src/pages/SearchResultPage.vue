<template>
  <user-card-list
      :user-list="userList"
  />
  <van-empty v-if="!userList || userList.length<1" description="搜索结果为空"/>

</template>

<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import myAxios from '../plugins/myAxios';
import qs from 'qs';
import {useRoute} from 'vue-router'
import {showToast} from "vant";
import {UserType} from "../models/user";
import UserCardList from "../components/user-card-list.vue";

const route = useRoute()
const {tags} = route.query;

// const mockUser = {
//     id: 1,
//     username: 'hikari',
//     userAccount: 'accout',
//     avatarUrl: 'https://ts1.cn.mm.bing.net/th/id/R-C.57384e4c2dd256a755578f00845e60af?rik=uy9%2bvT4%2b7Rur%2fA&riu=http%3a%2f%2fimg06file.tooopen.com%2fimages%2f20171224%2ftooopen_sy_231021357463.jpg&ehk=whpCWn%2byPBvtGi1%2boY1sEBq%2frEUaP6w2N5bnBQsLWdo%3d&risl=&pid=ImgRaw&r=0',
//     gender: 1,
//     phone: '123123',
//     email: '1231231',
//     userStatus: 1,
//     userRole: 1,
//     tags: ['男','Java'],
//     createTime: '2004-05-24',
//     profile: '个人信息',
//   };

const userList:Ref<UserType[]> = ref([]);

onMounted(async () => {
  // 为给定 ID 的 user 创建请求
  const userListData = await myAxios.get('/user/search/tags', {
    withCredentials: false,
    params: {
      tagNameList: tags
},
    paramsSerializer: {
      serialize: params => qs.stringify(params, { indices: false}),
    }
  }).then(function (response) {
        console.log('/user/search/tags succeed', response);
        showToast('请求成功');
        return response?.data;
      })
      .catch(function (error) {
        console.log('/user/search/tags error', error);
        showToast('请求失败');
      });
  if (userListData) {
    userListData.forEach((user:UserType) => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags);
      }
    })
    userList.value = userListData;
  }
})


</script>

<style scoped>

</style>