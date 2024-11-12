const isDev = import.meta.env.MODE === 'development'
const ip = isDev ? 'localhost' : import.meta.env.GAME_HOST
const port = import.meta.env.GAME_PORT || '7788'

export const baseURL = `http://${ip}:${port}`
