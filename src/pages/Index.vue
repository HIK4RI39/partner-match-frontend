<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {showToast} from "vant";
import {UserType} from "../models/user";
import UserCardList from "../components/user-card-list.vue";

const userList:Ref<UserType[]> = ref([]);

const currentPage = ref(  1);
const total = ref(50);
const pageSize = ref(10);

const doResearch = async () => {
  const userListData = await myAxios.get(
      '/user/recommend', {
        params:{
          currentPage: currentPage.value,
          total: total.value,
          pageSize: pageSize.value
        }
      }
  ).then(function (response) {
    // showToast('请求成功');
    return response?.data;
  })
      .catch(function (error) {
        console.log('/user/search/tags error', error);
        showToast('请求失败');
      });

  if (userListData) {
    userListData.list.forEach((user:UserType) => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags);
      }
    })
    console.log("userListData: ",userListData);
    userList.value = userListData.list;
    total.value = userListData.total;
  }
}


onMounted(async () => {
  await doResearch();
});

</script>

<template>
<!--  :desc="user.profile"-->
  <div id="content">
    <user-card-list
        :user-list="userList"
    />
    <van-empty v-if="!userList || userList.length<1" description="搜索结果为空"/>

    <van-pagination
        v-model="currentPage"
        :total-items="total"
        :show-page-size="pageSize"
        :page-count="Math.ceil(total/pageSize)"
        @change="doResearch"
        force-ellipses
        style="
          position: fixed; bottom: 0;
          padding: 50px;
          width: 100%;
          text-align: center;"
    >
      <template #prev-text>
        <van-icon name="arrow-left" />
      </template>

      <template #next-text>
        <van-icon name="arrow" />
      </template>

      <template #page="{ text }">{{ text }}</template>
    </van-pagination>
  </div>


</template>

<style scoped>

</style>