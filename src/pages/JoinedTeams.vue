<template>
  <div id="content">
    <van-card
        v-for="team in teamList"
        :title="`${team.title}`"
        :desc="team.description ? team.description : '未填写队伍简介'"
        :tag="`${team.number}人`"
        :thumb="team.avatarUrl"
    >
      <template #tags>
        <van-tag plain type="primary" v-if="team.status===0">公开</van-tag>
        <van-tag plain type="danger" v-if="team.status===1">加密</van-tag>
        <van-tag plain type="success" v-if="team.status===2">私有</van-tag>
      </template>
      <template #bottom>
        队伍人数: {{team.memberNumber}}/{{team.number}}

        <br>
        过期时间: {{team.expireTime}}
      </template>

      <template  #num>
        <van-image
            v-for="user in team.members"
            round fit="cover" width="30px" height="30px" style="margin-left: 5px"
            :src=user.avatarUrl
        />
      </template>
      <template #footer>
        <van-button size="small" type="danger" v-if="team.showDelete" @click="handleDelete(team)">解散队伍</van-button>
        <van-button size="small" type="primary" v-if="team.showDelete" @click="handleEdit(team)">编辑队伍</van-button>
        <van-button size="small" type="warning" v-if="team.showQuit" @click="handleQuit(team)">退出队伍</van-button>
      </template>
    </van-card>

    <van-empty v-if="!teamList || teamList.length<1" description="没有符合条件的队伍"/>
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

const user:Ref<UserType> = ref();

const handleDelete = (team:TeamType) => {
  showConfirmDialog({
    title: "解散队伍提示",
    message: "确认解散该队伍吗? 解散后队伍无法恢复"
  }).then(() => {
    myAxios.post("/team/delete", team).then((res:BaseResponse) => {
      if(res?.code===0){
        showToast("解散成功!");
        //跳转url
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    }).catch(() => {
      // on cancel
    })}
  )};

const handleEdit = (team:TeamType) => {
  router.push({
    path: '/team/edit',
    query: {
      team: JSON.stringify(team),
    }
  })
}

const handleQuit = async (team:TeamType) => {
  showConfirmDialog({
    title: "退队提示",
    message: user.value.id==team.userId ? "你当前是队伍队长\n退出队伍后将会移交队长职位,\n如果最后退出将解散队伍\n确定退出队伍吗?" : "确定退出队伍吗?"
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

const doSearch = async () => {
  const userListData = await myAxios.get('/team/joinedTeams', {
  }).then(function (response) {
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

