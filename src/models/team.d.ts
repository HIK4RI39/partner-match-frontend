export type TeamType = {
    id: number;
    title: string;
    avatarUrl?: string;
    status: number;

    expireTime: Date;
    number: number;
    description?: string;
    createTime: Date;
    userId: number;

    showQuit: boolean;
    showDelete: boolean;
    showJoin: boolean;
};