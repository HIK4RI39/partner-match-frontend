import Index from "../pages/Index.vue";
import Team from "../pages/Team.vue";
import User from "../pages/User.vue";
import Search from "../pages/Search.vue";
import UserEdit from "../pages/UserEdit.vue";
import SearchResultPage from "../pages/SearchResultPage.vue";
import UserLoginPage from "../pages/UserLoginPage.vue";
import UserAvatar from "../pages/UserAvatar.vue";
import UserInfo from "../pages/UserInfo.vue";
import MyTeams from "../pages/MyTeams.vue";
import CreateTeam from "../pages/CreateTeam.vue";
import JoinedTeams from "../pages/JoinedTeams.vue";
import TeamEdit from "../pages/TeamEdit.vue";


const routes = [
    {path: '/', title: '主页', component: Index},
    {path: '/team', title: '组队',  component: Team},
    {path: '/team/edit', title: '队伍编辑',  component: TeamEdit},
    {path: '/team/creatTeam', title: '新建队伍',  component: CreateTeam},
    {path: '/user', title: '个人主页',  component: User},
    {path: '/user/info', title: '用户信息',  component: UserInfo},
    {path: '/user/myTeams', title: '我创建的队伍',  component: MyTeams},
    {path: '/user/joinedTeams', title: '我加入的队伍',  component: JoinedTeams},
    {path: '/search', title: '搜索用户',  component: Search},
    {path: '/user/edit', title: '编辑个人信息',  component: UserEdit},
    {path: '/user/list', title: '搜索列表',  component: SearchResultPage},
    {path: '/user/login', title: '用户登录',  component: UserLoginPage},
    {path: '/user/avatar', title: '用户上传头像',  component: UserAvatar},
]

export default routes