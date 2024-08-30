<template>
  <van-card
      v-for="user in userList"
      :desc="user.profile"
      :title="`${user.username} (${user.userAccount})`"
      :thumb="user.avatarUrl"
      :tag="user.id"
  >
    <template #tags>
      <van-tag plain type="danger" v-for="tag in user.tags" style="margin-right: 8px">
        {{ tag }}
      </van-tag>
    </template>
    <template #footer>
      <van-button size="mini">联系我</van-button>
    </template>
  </van-card>

  <van-empty v-if="!userList || userList.length<1" description="搜索结果为空"/>

</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import myAxios from '../plugins/myAxios';
import qs from 'qs';
import {useRoute} from 'vue-router'
import {showToast} from "vant";

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

const userList = ref([]);

onMounted(async () => {
  // 为给定 ID 的 user 创建请求
  const userListData = await myAxios.get('/user/search/tags', {
    withCredentials: false,
    params: {
      tagNameList: /*JSON.stringify(tags)*/ tags

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
    userListData.forEach(user => {
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