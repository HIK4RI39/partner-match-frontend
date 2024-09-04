<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="title"
          name="title"
          label="队名"
          placeholder="填写队名"
          :rules="[{ required: true, message: '队名是必填项' }]"
      />

      <van-field
          v-model="description"
          name="description"
          tyoe="textarea"
          label="队伍简介"
      />

      <van-field name="number" label="队伍人数">
        <template #input>
          <van-stepper v-model="number" />
        </template>
      </van-field>

      <van-field name="status" label="队伍可见性">
        <template #input>
          <van-radio-group v-model="checked" direction="horizontal">
            <van-radio name='0'>公开</van-radio>
            <van-radio name='1'>加密</van-radio>
            <van-radio name='2'>私有</van-radio>
          </van-radio-group>
        </template>
      </van-field>

      <van-field name="switch" label="启用密码">
        <template #input>
          <van-switch v-model="withPWD" />
        </template>
      </van-field>

      <van-field
          v-model="password"
          name="password"
          tyoe="textarea"
          label="队伍密码"
          v-if="withPWD"
      />


      <van-field
          v-model="expireTime"
          is-link
          readonly
          name="expireTime"
          label="过期时间"
          placeholder="选择队伍的加入时限, 需要在当前时间之后"
          @click="showPicker = true"
          :rules="[{ required: true, message: '过期时间是必填项' }]"
      />
      <van-popup v-model:show="showPicker" position="bottom">
        <van-date-picker @confirm="onConfirm" @cancel="showPicker = false" />
      </van-popup>
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
import {showConfirmDialog, showToast} from "vant";
import myAxios from "../plugins/myAxios.ts";
import {BaseResponse} from "../models/baseResponse";
import {useRouter} from "vue-router";

const router = useRouter();

const title = ref('');
const description = ref('');
const password = ref('');
const number = ref(2);
const checked = ref('0');
const expireTime = ref('');

const withPWD = ref(false);

const showPicker = ref(false);

const onConfirm = ({ selectedValues }) => {
  //2025-07-16T08:20:30Z
  expireTime.value = selectedValues.join('-');
  expireTime.value = expireTime.value + "T00:00:00Z";
  showPicker.value = false;
};

const onSubmit = (values) => {
  console.log('submit', values);

  showConfirmDialog({
    title: "创建队伍",
    message: "确认提交数据吗?"
  }).then(() => {
    myAxios.post("/team/add", values).then((res:BaseResponse) => {
      if(res.code === 0){
        showToast("队伍创建成功!");
        //跳转url
        setTimeout(() => {
          router.push('/user/myTeams');
        }, 1000);
      }}).catch(() => {
      // on cancel
    })}
  )
};


</script>

<style scoped>

</style>