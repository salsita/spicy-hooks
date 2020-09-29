import { BehaviorSubject, Observable } from 'rxjs'

const SynchronousObservableSymbol = Symbol('synchronous observable')

export class GuaranteedSynchronousObservable<T> extends Observable<T> {
  [SynchronousObservableSymbol] = true
}

export type SynchronousObservable<T> = BehaviorSubject<T> | GuaranteedSynchronousObservable<T>
