import { defineConfig } from '@vue/cli-service'
import { config as dotenvConfig } from 'dotenv'

// Load environment variables from .env file
dotenvConfig()

export default defineConfig({
  transpileDependencies: true,
})
