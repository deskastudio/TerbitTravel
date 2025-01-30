/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    // tambahkan env variable lain jika ada
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }