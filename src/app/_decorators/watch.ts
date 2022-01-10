import { forkJoin, Observable, of, Subject } from 'rxjs';
import { first, map, switchMap, takeUntil } from 'rxjs/operators';
import { DecoratorsService } from './decorators.service';
import { ɵmarkDirty as markDirty } from '@angular/core';
import { QueryArgs } from './base';

export function Watch(args: QueryArgs): PropertyDecorator {
  return (target: any, propertyKey: PropertyKey): void => {
    const originalInit = target.ngOnInit; // tslint:disable-line
    Object.defineProperty(target, 'ngOnInit', {
      value(): void {
        if (!this.destroy$) {
          this.destroy$ = new Subject<void>();
        }

        const apollo = DecoratorsService.apollo;
        if (!apollo) {
          throw new Error(`Apollo is not initialized. Property: ${propertyKey.toString()}`);
        }

        const variables$ = prepareVariables(args);
        variables$
          .pipe(
            switchMap(variables => {
              console.log(variables);
              return apollo
                .watchQuery<any, any>({
                  query: args.query,
                  variables,
                })
                .valueChanges
                .pipe(
                  map((result) => {
                    console.log(result);
                    if (args.projector) {
                      return args.projector(result.data);
                    }

                    return result.data;
                  }),
                  takeUntil(this.destroy$),
                );
            }),
          )
          .subscribe(value => {
            this[propertyKey] = value;
            markDirty(this);
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

function prepareVariables(args: QueryArgs): Observable<any> {
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
