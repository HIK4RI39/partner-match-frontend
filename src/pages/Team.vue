<template>

  <div id="content">
    <van-dialog
        v-model:show="show"
        title="加入队伍"
        show-cancel-button
        readonly=""
        @confirm="doJoin"
        @cancel="handleCancel()"
    >
      <van-form ref="formData">
        <van-field
            v-model="formData.password"
            required
            label="密码"
            input-align="left"
            placeholder="请输入队伍密码"
            v-if="formData?.team?.status==1"
        />
      </van-form>
    </van-dialog>



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
<!--        <van-button size="small" type="success">查看详情</van-button>-->
        <van-button size="small" type="warning" v-if="team.showQuit" @click="hanleQuit(team)">退出队伍</van-button>
        <van-button size="small" type="primary" v-if="team.showJoin" @click="handleJoin(team)">加入队伍</van-button>
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
import {BaseResponse} from "../models/baseResponse";

const teamList:Ref<TeamType[]> = ref([]);

const currentPage = ref(  1);
const total = ref(50);
const user:UserType = ref();
const pageSize = ref(10);
const show = ref(false);


const formData = ref(
    {
      password: '',
      id: 0,
      team: ref() as Ref<TeamType>,
    }
);

const handleDelete = (team:TeamType) => {
  showConfirmDialog({
    title: "删除提示",
    message: "确认删除该队伍吗? 删除后无法恢复"
  })
      .then(() => {
        myAxios.post("/team/delete", team)}
      ).then((res:BaseResponse) => {
        if(res?.data===0){
          location.reload()        }
      }
      ).catch(() => {
        // on cancel
      });
};

const hanleQuit = async (team:TeamType) => {
  showConfirmDialog({
    title: "退队提示",
    message: "确认退出队伍吗?"
  }).then(() => {
    myAxios.post("/team/quit", team).then((res:BaseResponse) => {
      if(res.code === 0){
        location.reload();
      }}).catch(() => {
    // on cancel
  })}
)};

const handleJoin = (team:TeamType) => {
  show.value = true;
  formData.value.team = team;
  formData.value.id = team.id;
}

const doJoin = async () => {
  await myAxios.post("/team/join", formData.value)
      .then((res:BaseResponse) => {
        if(res.code === 0){
          showToast("加入成功")

          setTimeout(() => {
            location.reload();
          }, 1000);

        }
      })
}

const handleCancel = () => {
  show.value = false;
  formData.value.password = '';
}


const doSearch = async () => {
  const userListData = await myAxios.get('/team/list', {
    withCredentials: false,
    params: {
      currentPage: currentPage.value
    },
  }).then(function (response) {
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
    teamList.value = userListData.list;
    total.value = userListData.total;
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

