import { Subject } from 'rxjs'

import { bind } from './bind'

describe('bind', () => {
  it('bind a function to the emitted value', () => {
    let emission: (() => string) | null = null
    const subject = new Subject<number>()
    const result$ = subject.pipe(bind(num => `num: ${num}`))
    result$.subscribe({
      next: value => {
        emission = value
      }
    })
    subject.next(1)

    expect(typeof emission).toEqual('function')

    const value = emission!()
    expect(value).toBe('num: 1')
  })

  it('binds every emission separately', () => {
    const emissions: Array<() => string> = []
    const subject = new Subject<number>()
    const result$ = subject.pipe(bind(num => `num: ${num}`))
    result$.subscribe({
      next: value => {
        emissions.push(value)
      }
    })
    subject.next(1)
    subject.next(2)
    subject.next(3)

    expect(emissions.map(emission => emission())).toEqual(['num: 1', 'num: 2', 'num: 3'])
  })
})
