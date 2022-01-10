import { forkJoin, Observable, of, Subject } from 'rxjs';
import { first, switchMap, takeUntil } from 'rxjs/operators';
import { DecoratorsService } from './decorators.service';
import { MutationArgs } from './base';

export function Mutate(args: MutationArgs): PropertyDecorator {
  return (target: any, propertyKey: PropertyKey): void => {
    const originalInit = target.ngOnInit; // tslint:disable-line
    Object.defineProperty(target, 'ngOnInit', {
      value(): void {
        if (!this.destroy$) {
          this.destroy$ = new Subject<void>();
        }
        if (!this.events$) {
          this.events$ = new Subject<void>();
        }

        const apollo = DecoratorsService.apollo;
        if (!apollo) {
          throw new Error(`Apollo is not initialized. Property: ${propertyKey.toString()}`);
        }

        this[propertyKey]
          .pipe(takeUntil(this.destroy$))
          .subscribe((params: any) => {
            console.log(params);

            this.events$.next({ field: propertyKey, type: 'loading', value: true });

            const variables$ = prepareVariables(args);
            variables$
              .pipe(
                switchMap(variables => {
                  console.log(variables);
                  return apollo
                    .mutate<any, any>({
                      mutation: args.mutation,
                      variables,
                    });
                }),
                takeUntil(this.destroy$),
              )
              .subscribe(
                result => {
                  this.events$.next({ field: propertyKey, type: 'success', data: result.data });
                },
                error => {
                  this.events$.next({ field: propertyKey, type: 'error', error });
                },
              );
          });

        if (originalInit) {
          originalInit.call(this);
        }
      },
      configurable: true,
    });

    const originalDestroy = target.ngOnDestroy; // tslint:disable-line
    Object.defineProperty(target, 'ngOnDestroy', {
      value(): void {
        if (this.destroy$) {
          this.destroy$.next();
          this.destroy$.complete();
          this.destroy$ = null;
        }

        if (originalDestroy) {
          originalDestroy.call(this);
        }
      },
      configurable: true,
    });
  };
}

function prepareVariables(args: MutationArgs): Observable<any> {
  if (!args.variables || !Object.keys(args.variables).length) {
    return of({});
  }

  const observables: any = {};
  for (const [key, value] of Object.entries(args.variables)) {
    if (value instanceof Function) {  // selector
      observables[key] = DecoratorsService.store.select(value).pipe(first());
    } else {
      observables[key] = of(value);
    }
  }
  return forkJoin(observables);
}
