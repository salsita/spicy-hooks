import { Observable } from 'rxjs'
import { latency } from '@spicy-hooks/utils'

export function createAsyncObservable (value: number, delay: number, log?: string[]) {
  return new Observable<number>(subscriber => {
    log?.push(`start ${value}`)
    latency(delay).then(() => {
      if (value < 0) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw `error ${value}`
      } else {
        log?.push(`emit ${value}`)
        subscriber.next(value)
        log?.push(`complete ${value}`)
        subscriber.complete()
        log?.push(`after complete ${value}`)
      }
    }).catch(err => {
      log?.push(`fail ${value}`)
      subscriber.error(err)
    })
  })
}
