<template>

  <div id="content">
    <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词/按下enter检索队伍"
        @search="onSearch"
        @cancel="onCancel"
    />

    <van-dialog
        v-model:show="show"
        title="加入队伍"
        show-cancel-button
        @confirm="doJoin"
        @cancel="handleCancel()"
    >
      <van-form ref="formData">
        <van-field
            v-model="refForm.password"
            required
            label="密码"
            input-align="left"
            placeholder="请输入队伍密码"
            v-if="refForm?.team?.status==1"
        />
      </van-form>
    </van-dialog>


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

        <van-button size="small" type="primary" v-if="team.showJoin" @click="handleJoin(team)">加入队伍</van-button>
      </template>
    </van-card>

    <van-empty v-if="!teamList || teamList.length<1" description="没有符合条件的队伍"/>

    <van-floating-bubble
        axis="xy"
        icon="plus"
        magnetic="x"
        @click="onCreate()"
    />
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
import {useRouter} from "vue-router";

const teamList:Ref<TeamType[]> = ref([]);

const currentPage = ref(  1);
const total = ref(50);
const user:Ref<UserType> = ref();
const pageSize = ref(10);
const show = ref(false);
const searchText = ref('');
const router = useRouter();

const onCreate = () => {
  router.push("/team/creatTeam")
}

const handleEdit = (team:TeamType) => {
  router.push({
    path: '/team/edit',
    query: {
      team: JSON.stringify(team),
    }
  })
}

const onSearch = async () => {
  const teamListData = await myAxios.get('/team/search', {
    withCredentials: false,
    params: {
      searchText: searchText.value,
      currentPage: currentPage.value
    }}).then(function (response) {
    return response?.data;
  }).catch(function (error) {
    console.log('/user/search/tags error', error);
    showToast('请求失败');
  });
  if (teamListData) {
    teamList.value = teamListData.list;
    total.value = teamListData.total;
  }
}

const onCancel = () => {
  searchText.value = '';
}

const formData = ref({});

const refForm = ref(
    {
      password: '',
      id: 0,
      team: ref() as Ref<TeamType>
    }
)

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

const handleJoin = (team:TeamType) => {
  refForm.value.team = team;
  refForm.value.id = team.id;

  setTimeout(() => {
    show.value = true;
    }, 100);

}

const doJoin = async () => {
  await myAxios.post("/team/join", refForm.value)
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
  refForm.value.password = '';
}


const doSearch = async () => {
  const teamListData = await myAxios.get('/team/list', {
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
  if (teamListData) {
    teamList.value = teamListData.list;
    total.value = teamListData.total;
  }

  console.log("value:", teamList.value);
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

