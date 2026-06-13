import { copyFileSync, existsSync } from 'fs'

// Копіює resume.json (лежить у корені, а не в public/) у dist,
// щоб fetch('/resume.json') працював і після `npm run build`.
const copyResumeJson = {
  name: 'copy-resume-json',
  closeBundle() {
    if (existsSync('resume.json')) {
      copyFileSync('resume.json', 'dist/resume.json')
    }
  }
}

export default {
  plugins: [copyResumeJson],
  server: {
    open: true,
    port: 3000,
    hmr: {
      overlay: false
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
}
