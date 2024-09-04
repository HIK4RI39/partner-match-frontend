<template>

  <div id="content">
    <van-card
        v-for="team in teamList"
        :title="`${team.title}    (${team.members}/${team.number})`"
        :desc="`${team.description}(有效期至:${team.expireTime})`"
        :tag="`${team.number}人`"
        :thumb="team.avatarUrl"
    >
      <template #tags>
        <van-tag plain type="primary" v-if="team.status===0">公开</van-tag>
        <van-tag plain type="danger" v-if="team.status===1">加密</van-tag>
      </template>
      <template #footer>
        <van-button size="small" type="danger" v-if="team.showDelete" @click="handleDelete(team)">删除队伍</van-button>
        <van-button size="small" type="warning" v-if="team.showQuit" @click="hanleQuit(team)">退出队伍</van-button>
      </template>
    </van-card>

    <van-empty v-if="!teamList || teamList.length<1" description="没有符合条件的队伍"/>
    </div>

    <div style="margin: 16px;" v-if="!teamList || teamList.length<=5">
      <van-button round block type="primary" @click="createTeam">
        新建队伍
      </van-button>
    </div>
</template>

<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import {TeamType} from "../models/team";
import myAxios from "../plugins/myAxios.ts";
import {showConfirmDialog,showToast} from "vant";
import {UserType} from "../models/user";
import {GetCurrentUser} from "../services/user.ts";
import {BaseResponse} from "../models/baseResponse";
import {useRouter} from "vue-router";

const router = useRouter();
const teamList:Ref<TeamType[]> = ref([]);

const user:UserType = ref();


const handleDelete = (team:TeamType) => {
  showConfirmDialog({
    title: "删除提示",
    message: "确认删除该队伍吗? 删除后无法恢复"
  })
      .then(() => {
        myAxios.post("/team/delete", team).then((res:BaseResponse) => {
          console.log(res)
          if(res?.code===0){
            console.log(res?.code)
            showToast("删除成功!");
            //跳转url
            setTimeout(() => {
              location.reload();
            }, 1000);
          }
        }).catch(() => {
          // on cancel
        });}
      )
};

const hanleQuit = async (team:TeamType) => {
  showConfirmDialog({
    title: "退队提示",
    message: "确认退出队伍吗?"
  }).then(() => {
    myAxios.post("/team/quit", team).then((res:BaseResponse) => {
      if(res?.code===0){
        showToast("退出队伍成功");
        //跳转url
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    }).catch(() => {
      // on cancel
    })}
  )};

const createTeam = () => {
  router.push("/team/creatTeam");
}

const doSearch = async () => {
  const userListData = await myAxios.get('/team/myTeams', {
  }).then(function (response) {
    // showToast('请求成功');
    return response?.data;
  }).catch(function (error) {
        console.log('/user/search/tags error', error);
        showToast('请求失败');
  });

  if (userListData) {
    teamList.value = userListData;
  }
}

onMounted(async () => {
  const res = await GetCurrentUser();
  if(res){
    user.value = res;
  }else {
    showToast("用户未登录");
  }

  await doSearch();
})

</script>

<style scoped>
#content {
  padding-bottom: 150px;
}
</style>

