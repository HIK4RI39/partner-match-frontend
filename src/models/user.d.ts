export type UserType = {
    id: number;
    username: string;
    userAccount: string;
    avatarUrl?: string;
    gender: number;
    phone?: string;
    email?: string;
    userStatus: number;
    userRole: number;
    tags?: string;
    createTime: Date;
    profile?: string;
};