<template>
  <van-card
      v-for="user in userList"
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
</template>

<script setup lang="ts">
import {UserType} from "../models/user";

interface UserCardListProps {
  userList: UserType[];
}

const props = withDefaults(defineProps<UserCardListProps>(), {
  userList: [] as UserType[],
});
</script>

<style scoped>

</style>