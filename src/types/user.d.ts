interface IUser {
    _id: string,
    userName: string,
    fullname: string,
    email: string,
    isBan: boolean,
    status: string,
    role: string,
    accountType: string,
    isActive: boolean,
    activeCode: string,
    codeExpired: string,
    updatedAt: string
}

interface IUserPagination {
    meta: IUserMeta,
    result: IUser[]
}

interface IUserMeta {
    current: number,
    pageSize: number,
    pages: number,
    total: number,
}

interface ICreateUserByManager {
    fullname: string,
    userName: string,
    email: string,
    password: string
    confirmPassword?: string
}