import { Observable } from 'rxjs'
import { latency } from '@spicy-hooks/utils'

/**
 * Create a dummy async observable that emits a single `value` after the specified `delay` and then completes.
 *
 * @param value the value to emit or `-1` to throw an exception instead
 * @param delay delay in milliseconds before the observable should emit
 * @param log optional string array where a simple log messages get appended as the flow of the observable proceeds
 * @category Test Helper
 */
export function createAsyncObservable (value: number, delay: number, log?: string[]): Observable<number> {
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
