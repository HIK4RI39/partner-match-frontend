<template>
  <div id="content">
    <van-card
        v-for="user in userList"
        :title="`${user.username}`"
        :thumb="user.avatarUrl"
        :tag="user.id"
        :desc="user.profile ? user.profile : '此用户没有填写个人简介'"
    >
      <template #tags>
        <van-tag plain type="danger" v-for="tag in user.tags" style="margin-right: 8px">
          {{ tag }}
        </van-tag>
      </template>
      <template #footer>
        <van-button size="mini" @click="onConnect(user)">联系我</van-button>
      </template>
    </van-card>
  </div>
</template>

<script setup lang="ts">
import {UserType} from "../models/user";
import {useRouter} from "vue-router";
// import {showDialog} from "vant";

const router = useRouter();

interface UserCardListProps {
  userList: UserType[];
}

const props = withDefaults(defineProps<UserCardListProps>(), {
  userList: [] as UserType[],
});

const onConnect = (user : UserType) => {
  // showDialog({
  //   title: '联系方式',
  //   message: `电话: ${user.phone}\n邮箱: ${user.email}`,
  // }).then(() => {
  //   // on close
  // });

  router.push({
    path: '/user/chat',
    query: {
      id: user.id as number,
    }})
}
</script>

<style scoped>
#content {
  padding-bottom: 100px;
}
</style>