import { deferredFn } from './deferred-fn'

describe('deferredFn', () => {
  it('allows waiting for an async call', async () => {
    const fn = deferredFn()
    setTimeout(fn, 1)
    await expect(fn.afterNextCall()).resolves.toHaveBeenCalled()
  })

  it('supports sub-sequent calls', async () => {
    const fn = deferredFn()
    setTimeout(fn, 1)
    await expect(fn.afterNextCall()).resolves.toHaveBeenCalledTimes(1)
    setTimeout(fn, 1)
    await expect(fn.afterNextCall()).resolves.toHaveBeenCalledTimes(2)
  })

  it('allows inspecting the current state', async () => {
    const fn = deferredFn()
    expect(fn).toHaveBeenCalledTimes(0)
    setTimeout(fn, 1)
    await fn.afterNextCall()
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
