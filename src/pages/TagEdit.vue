<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRouter} from 'vue-router'
import {showToast} from "vant";
import {BaseResponse} from "../models/baseResponse";
import myAxios from "../plugins/myAxios.ts";
import qs from "qs";
import {updateCurrentUser} from "../states/user.ts";
const router = useRouter()

/**
 * 关闭标签
 * @param tag
 */
const doClose = (tag : any) => {
  //选中的tag返回false => 从activeIds中移除此tag
  activeIds.value = activeIds.value.filter(item => {
    return item !== tag;
  })
};

/**
 * 修改标签
 */
const doSubmit = async () => {
   await myAxios.get('/user/update/tags', {
    withCredentials: false,
    params: {
      tagNameList: activeIds.value,
    },
    paramsSerializer: {
      serialize: params => qs.stringify(params, { indices: false}),
    }
  }).then ((res:BaseResponse) => {
    if(res?.code === 0){
      //修改当前用户标签

      showToast("修改成功!");

      updateCurrentUser('tags', activeIds.value);

      setTimeout(() => {
        router.push("/user/info");
      }, 1200);

    }else{
      //显示错误信息
      showToast(res?.errorMsg);
    }
   })

}

// ?
const activeIds = ref([]);
const activeIndex = ref(0);


onMounted(async () => {
  // 从后端获取当前用户的标签
  await myAxios.get('/user/getTags')
      .then((res:BaseResponse) => {
        if(res.code === 0){
          activeIds.value = res.data;
        }else {
          showToast(res.errorMsg);
        }
      })
})

const originalTagList = [
  {
    text: '性别',
    children: [
      { text: '男', id: '男' },
      { text: '女', id: '女' },
    ],
  }, {
    text: '年级',
    children: [
      { text: '大一', id: '大一' },
      { text: '大二', id: '大二' },
      { text: '大三', id: '大三' },
      { text: '大四', id: '大四' },
    ],
  }, {
    text: '编程语言',
    children: [
      { text: 'Java', id: 'Java'},
      { text: 'C++', id: 'C++'},
      { text: 'C#', id: 'C#'},
      { text: 'Golang', id: 'Golang'},
      { text: 'Python', id: 'Python'},
    ]
  },{
    text: '职业',
    children: [
      { text: '前端', id: '前端'},
      { text: '后端', id: '后端'},
      { text: '全栈', id: '全栈'},
      { text: '开发', id: '开发'},
      { text: '运维', id: '运维'},
      { text: '产品经理', id: '产品经理'},
    ]
  }
];

let tagList = ref(originalTagList);
</script>

<template>

  <van-divider content-position="left">已选标签</van-divider>
  <!--如果没有选择标签显示-->
  <div v-if="activeIds.length === 0">请选择标签</div>
  <van-row gutter="10" style="padding: 0 10px">
    <van-col v-for="tag in activeIds">
      <van-tag  :show=true closeable size="small" type="primary" @close="doClose(tag)">
        {{ tag }}
      </van-tag>
    </van-col>

  </van-row>

  <van-divider content-position="left">选择标签</van-divider>
  <van-tree-select class="tree-select"
      v-model:active-id="activeIds"
      v-model:main-active-index="activeIndex"
      :items="tagList"
  />

  <div style="
          padding: 12px;
          position: fixed; bottom: 50px;
          width: 100%;
          text-align: center;">
    <van-button block type="primary" @click="doSubmit">提交</van-button>
  </div>
</template>

<style scoped>
.tree-select {
  color: black;
}
</style>