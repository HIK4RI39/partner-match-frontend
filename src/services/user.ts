import myAxios from "../plugins/myAxios.ts";
import {getCurrentUserState, setCurrentUserState} from "../states/user.ts";
import {BaseResponse} from "../models/baseResponse";

export const GetCurrentUser = async () => {
    const currentUser = getCurrentUserState();
    if(currentUser){
        return currentUser;
    }

    //不存在则访问后端
    const res = <BaseResponse> await myAxios.get('/user/current');

    if(res?.code === 0){
        setCurrentUserState(res.data);
        return res.data;
    }

    return null;
}
