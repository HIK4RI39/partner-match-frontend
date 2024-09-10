<template>
  <van-cell title="头像">
    <van-uploader
        v-model="fileList"
        multiple :max-size="500 * 1024"
        @oversize="onOversize"
        reupload max-count="1"
        :after-read="afterRead"
        :before-read="beforeRead"
    />
  </van-cell>

      <van-button round block type="primary" @click="updateAvatar(url)">
        提交
      </van-button>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {showToast} from "vant";
import myAxios from "../../plugins/myAxios.ts";
import {BaseResponse} from "../../models/baseResponse";
import {updateCurrentUser} from "../../states/user.ts";
const route = useRoute();
const router = useRouter();

const avatarUrl = ref(route.query.avatarUrl);
const forms = new FormData();
var url = ref('');

const fileList = ref([
  {
    url: avatarUrl,
    deletable: true,
  }
]);

const onOversize = () => {
  showToast('文件大小不能超过 500kb');
};

const beforeRead = (file) => {
    if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
      showToast('仅限上传jpeg/jpg/png格式文件');
      return false;
    }
    return true;
}

const afterRead = async (file) => {
  file.status = 'uploading';
  file.message = '上传中...';
  //与后端字段名相同
  forms.append("image",file.file);

  file.status = 'done';
  await myAxios.post("/upload", forms).then((res:BaseResponse) => {
    if(res?.code===0){
      file.status = 'done';
      url = res.data;
    }else{
      file.status = 'failed';
      file.message = '上传失败';
    }
  }).catch(() => {
    file.status = 'failed';
    file.message = '上传失败';
  })
};

const updateAvatar = async (avatarUrl:string) => {
  if(avatarUrl===''){
    showToast('头像未更新!');
    return;
  }

  await myAxios.post(
    "/user/update/info",
      JSON.stringify({"avatarUrl": avatarUrl}),
      {
        headers: {'Content-Type':'application/json' }
      }).then((res:BaseResponse) => {
        if(res?.code===0){
          updateCurrentUser('avatarUrl', avatarUrl);
          setTimeout(() => {
            router.push("/user");
          }, 1200);
        }
  })
}

</script>


<style>

</style>