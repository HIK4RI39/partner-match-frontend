import Index from "../pages/Index.vue";
import Team from "../pages/Team.vue";
import User from "../pages/User.vue";
import Search from "../pages/Search.vue";
import UserEdit from "../pages/UserEdit.vue";
import SearchResultPage from "../pages/SearchResultPage.vue";
import UserLoginPage from "../pages/UserLoginPage.vue";
import UserAvatar from "../pages/UserAvatar.vue";


const routes = [
    {path: '/', title: '主页', component: Index},
    {path: '/team', title: '组队',  component: Team},
    {path: '/user', title: '个人页',  component: User},
    {path: '/search', title: '搜索',  component: Search},
    {path: '/user/edit', title: '信息编辑',  component: UserEdit},
    {path: '/user/list', title: '搜索列表',  component: SearchResultPage},
    {path: '/user/login', title: '用户登录',  component: UserLoginPage},
    {path: '/user/avatar', title: '用户上传头像',  component: UserAvatar},
]

export default routes