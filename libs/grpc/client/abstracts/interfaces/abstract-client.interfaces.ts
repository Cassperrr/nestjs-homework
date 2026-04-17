import type { Observable } from 'rxjs';

export type UnwrapObservable<U> = U extends Observable<infer R> ? R : U;
