/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly GAME_HOST: string
  readonly GAME_PORT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, any>
  export default component
}
