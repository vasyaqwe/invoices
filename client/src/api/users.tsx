import { User } from "@/types"
import { axiosPrivate, axiosRequest } from "./config"

export const createUser = async (data: User) =>
    axiosRequest(() => axiosPrivate.post(`/users`, data))
