import { Configuration, ConfigurationDetail, User } from "../schema"

export type LoginResponse = {
    user: User;
    token: string;
}

export type Login = {
    username: string
    password: string
}
export interface ConfigurationWithDetail extends Configuration {
    configuration_details: ConfigurationDetail[];
}