<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from 'vue-router'
const router = useRouter()

// 搜索文本
const searchText = ref('');

/**
 * 搜索标签
 */
const onSearch = () => {
  tagList.value = originalTagList.map(parentTag => {
    const tempChildren = [...parentTag.children];
    const tempParentTag = {...parentTag};
    tempParentTag.children = tempChildren.filter(item => item.text.includes(searchText.value));
    return tempParentTag;
  })};

/**
 * 清空标签搜索
 */
const onCancel = () => {
  searchText.value = ''
  tagList.value = originalTagList
};

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
 * 根据标签搜索
 */
const doSearchResult = () => {
  //将参数传递给搜索页
  router.push({
    path: '/user/list',
    query: {
      tags: activeIds.value
    }
  })

}

const activeIds = ref([]);
const activeIndex = ref(0);
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
    ],
  }, {
    text: '技术栈',
    children: [
      { text: '前端', id: '前端'},
      { text: '后端', id: '后端'},
      { text: 'Java', id: 'Java'},
      { text: 'C++', id: 'C++'},
      { text: 'Golang', id: 'Golang'},
    ]
  }
];

let tagList = ref(originalTagList);
</script>

<template>
  <form action="/">
    <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
    />
  </form>

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

  <div style="padding: 12px">
    <van-button block type="primary" @click="doSearchResult">搜索</van-button>
  </div>
</template>

<style scoped>
.tree-select {
  color: black;
}
</style>