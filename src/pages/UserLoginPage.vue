<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="userAccount"
          name="userAccount"
          label="账号"
          placeholder="请输入用户账号"
          :rules="[{require: true, message: '账户是必填项'}]"
      />
      <van-field
          v-model="userPassword"
          type="password"
          name="userPassword"
          label="密码"
          :placeholder="`请输入密码密码`"
          :rules="[{require: true, message: '密码是必填项'}]"
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
import {ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {showToast} from "vant";

const userAccount = ref('');
const userPassword = ref('');



  const onSubmit =(async () => {
    const res = await myAxios.post('/user/login',{
      //.value
      userAccount: userAccount.value,
      userPassword: userPassword.value
    })

    if(res?.data?.code === 0){
      showToast("登陆成功!");
      sessionStorage.setItem("authorization", res?.data?.data);
    }else{
      showToast(res?.data?.errorMsg);
    }

    return res;
  });


</script>

<style scoped>

</style>