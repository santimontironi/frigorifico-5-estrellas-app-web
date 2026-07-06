import api from "./api";

export const sendMailChangePassword = async (email: string) => {
    return api.post('/change-password', { email })
}

export const changePassword = async (token: string, newPassword: string) => {
    return api.post(`/change-password/${token}`, { newPassword })
}
