<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="userAccount"
          name="userAccount"
          label="账号"
          placeholder="管理员账号:admin | 用户账号:user"
          :rules="[{require: true, message: '账户是必填项'}]"
      />
      <van-field
          v-model="userPassword"
          type="password"
          name="userPassword"
          label="密码"
          placeholder="默认密码:12345678"
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
import myAxios from "../../plugins/myAxios.ts";
import {showToast} from "vant";
import {useRouter} from 'vue-router'
import {BaseResponse} from "../../models/baseResponse";
const router = useRouter()

const userAccount = ref('');
const userPassword = ref('');



  const onSubmit =(async () => {
    const res = <BaseResponse> await myAxios.post('/user/login',{
      //.value
      userAccount: userAccount.value,
      userPassword: userPassword.value
    })

    if(res?.code === 0){
      showToast("登陆成功!");
      sessionStorage.setItem("authorization", res?.data);
      setTimeout(() => {
        router.replace('/');
      }, 1000);
    }else{
      showToast(res?.errorMsg);
    }

    return res;
  });


</script>

<style scoped>

</style>