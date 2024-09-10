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
        <van-button size="small" type="primary" v-if="team.showQuit" @click="onChat(team)">进入群聊</van-button>
      </template>
    </van-card>

    <van-empty v-if="!teamList || teamList.length<1" description="尚未加入任何队伍"/>
  </div>
</template>

<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import {TeamType} from "../../models/team";
import myAxios from "../../plugins/myAxios.ts";
import {showToast} from "vant";
import {UserType} from "../../models/user";
import {GetCurrentUser} from "../../services/user.ts";
import {useRouter} from "vue-router";

const router = useRouter();
const teamList:Ref<TeamType[]> = ref([]);

const user:Ref<UserType> = ref();

const onChat = (team:TeamType) => {
  router.push({
    path: '/team/chat',
    query: {
      teamId: team.id,
      memberNumber: team.memberNumber,
      title: team.title,
      members: JSON.stringify(team.members),
    }
  })
}


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

