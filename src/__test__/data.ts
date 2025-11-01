// auth
export const loginUserPayload = {
    email: "test@g.com",
    password: "12345678",
}
export const createUserPayload = {
    ...loginUserPayload,
    name: "test",
    rememberMe: true,
}
