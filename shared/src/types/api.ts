import { User } from "../schema"

export type LoginResponse = {
    user: User;
    token: string;
}

export type Login = {
    username: string
    password: string
}