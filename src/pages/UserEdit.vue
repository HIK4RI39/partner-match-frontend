<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="editUser.currentValue"
          :name="editUser.editKey"
          :label="editUser.editName"
          :placeholder="`请输入${editUser.editName}`"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>

</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {BaseResponse} from "../models/baseResponse";
import {UserType} from "../models/user";
import {GetCurrentUser} from "../services/user.ts";
import {showToast} from "vant";
import {updateCurrentUser} from "../states/user.ts";

const currentUser = ref();

const route = useRoute();
const router = useRouter();

const editUser = ref({
  editKey: route.query.editKey,
  currentValue: route.query.currentValue,
  editName: route.query.editName,
})

onMounted(async () => {
  const res = <UserType>await GetCurrentUser();
  if (res) {
    currentUser.value = res;
    showToast("获取用户信息成功");
  } else {
    showToast("用户未登录");
    //跳转登录页
    setTimeout(() => {
      router.replace('/user/login');
    }, 1200);
  }
})

const onSubmit = (async () => {
  const res = <BaseResponse>await myAxios.post('/user/update/info', {
    "id": currentUser.value.id,
    [editUser.value.editKey]: editUser.value.currentValue,
  });
  if (res?.code === 0) {
    showToast("修改成功");

    updateCurrentUser(editUser.value.editKey, editUser.value.currentValue);


    setTimeout(() => {
      router.push("/user");
    }, 1200);
  } else {
    showToast("修改失败");
  }
});
</script>

<style scoped>

</style>