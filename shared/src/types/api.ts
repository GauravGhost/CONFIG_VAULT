export type LoginResponse = {
    id: string
    username: string
    email?: string
    role?: string
    token: string
}

export type Login = {
    username: string
    password: string
}