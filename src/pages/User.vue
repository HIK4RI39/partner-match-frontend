<template>
  <div>
    <van-cell title="昵称" is-link to="/user/edit" :value="user.username" />
    <van-cell title="头像" is-link to="/user/edit"  >
      <img style="height: 48px; width: 48px" :src="user.avatarUrl">
    </van-cell>
    <van-cell title="账号" is-link to="/user/edit" :value="user.userAccount" />
    <van-cell title="性别" is-link to="/user/edit" :value="user.gender" />
    <van-cell title="电话" is-link to="/user/edit" :value="user.phone" />
    <van-cell title="邮箱" is-link to="/user/edit" :value="user.email" />
    <van-cell title="注册时间" is-link to="/user/edit" :value="user.createTime.toString()" />
  </div>

</template>

<script setup lang="ts">
const user = {
  id: 1,
  username: 'hikari',
  userAccount: 'accout',
  avatarUrl: 'https://ts1.cn.mm.bing.net/th/id/R-C.57384e4c2dd256a755578f00845e60af?rik=uy9%2bvT4%2b7Rur%2fA&riu=http%3a%2f%2fimg06file.tooopen.com%2fimages%2f20171224%2ftooopen_sy_231021357463.jpg&ehk=whpCWn%2byPBvtGi1%2boY1sEBq%2frEUaP6w2N5bnBQsLWdo%3d&risl=&pid=ImgRaw&r=0',
  gender: 1,
  phone: '123123',
  email: '1231231',
  userStatus: 1,
  userRole: 1,
  tags: ['男','Java'],
  createTime: '2004-05-24'
};
</script>

<style scoped>

</style>