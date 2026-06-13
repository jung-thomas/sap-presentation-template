import { spawn } from 'node:child_process'

function which(cmd) {
  return new Promise((resolve) => {
    const isWin = process.platform === 'win32'
    const lookup = isWin ? 'where' : 'which'
    const child = spawn(lookup, [cmd], { stdio: 'ignore' })
    child.on('close', (code) => resolve(code === 0))
    child.on('error', () => resolve(false))
  })
}

export async function detectTools() {
  const [soffice, pdftoppm] = await Promise.all([which('soffice'), which('pdftoppm')])
  return { soffice, pdftoppm }
}
