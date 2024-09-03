<template>

  <div id="content">
    <van-card
        v-for="team in teamList"
        :title="`${team.title}`"
        :desc="`${team.description}(有效期至:${team.expireTime})`"
        :tag="`${team.number}人`"
        :thumb="team.avatarUrl"
    >
      <template #footer>
        <van-button size="mini" type="danger" v-if="team.userId===user.id" @click="handleDelete(team)">删除队伍</van-button>

        <van-button size="mini" type="warning">退出队伍</van-button>
        <van-button size="mini" type="success">查看详情</van-button>
        <van-button size="mini" type="primary">加入队伍</van-button>
      </template>
    </van-card>


  </div>
  <van-pagination
      v-model="currentPage"
      :total-items="total"
      :show-page-size="pageSize"
      :page-count="Math.ceil(total/pageSize)"
      @change="doSearch"
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
</template>

<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import {TeamType} from "../models/team";
import myAxios from "../plugins/myAxios.ts";
import {showConfirmDialog,showToast} from "vant";
import {UserType} from "../models/user";
import {GetCurrentUser} from "../services/user.ts";

const teamList:Ref<TeamType[]> = ref([]);

const currentPage = ref(  1);
const total = ref(50);
const user:UserType = ref();
const pageSize = ref(10);

const handleDelete = (team:TeamType) => {
  showConfirmDialog({
    title: "删除提示",
    message: "确认删除该队伍吗? 删除后无法恢复"
  })
      .then(() => {
        myAxios.post("/team/delete", team)}
      ).then(res => {
        location.reload()
      }
      ).catch(() => {
        // on cancel
      });
};

const doSearch = async () => {
  const userListData = await myAxios.get('/team/list', {
    withCredentials: false,
    params: {
      currentPage: currentPage.value
    },
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
    userListData.list.forEach((user:UserType) => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags);
      }
    })
    teamList.value = userListData.list;
    total.value = userListData.total;
  }
}

onMounted(async () => {
  const res = await GetCurrentUser();
  if(res){
    user.value = res;
    showToast("获取用户信息成功");
  }else {
    showToast("用户未登录");
  }

  await doSearch();
})

</script>

<style scoped>
#content {
  padding-bottom: 100px;
}
</style>

