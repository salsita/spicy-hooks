import spawnAsync from '@expo/spawn-async'

export async function getCurrentBranchName () {
  const { stdout } = await spawnAsync('git', ['rev-parse', '--abbrev-ref', 'HEAD'])
  return stdout.trim()
}
