import {UserType} from "../models/user";

let currentUser: UserType; // 初始化为null

const setCurrentUserState = (user: UserType) => {
    currentUser = user;
}

const getCurrentUserState = () : UserType=> {
    return currentUser;
}

const updateCurrentUser = (editKey :string, currentValue : string)  => {
    switch (editKey){
        case 'username':
            currentUser.username = currentValue;
            return;
        case 'gender':
            currentUser.gender = parseInt(currentValue);
            return;
        case 'phone':
            currentUser.phone = currentValue;
            return;
        case 'email':
            currentUser.email = currentValue;
            return;
        case 'avatarUrl':
            currentUser.avatarUrl = currentValue;
            return;
        case 'profile':
            currentUser.profile =currentValue;
            return;
    }
}

export {
    updateCurrentUser,
    setCurrentUserState,
    getCurrentUserState,
}