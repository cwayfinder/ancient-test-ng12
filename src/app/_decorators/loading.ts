import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { DataEvent } from './base';
import { ɵmarkDirty as markDirty } from '@angular/core';

export function Loading(...propertyNames: string[]): PropertyDecorator {
  return (target: any, propertyKey: PropertyKey): void => {
    const originalInit = target['ngOnInit']; // tslint:disable-line
    Object.defineProperty(target, 'ngOnInit', {
      value(): void {
        if (!this.destroy$) {
          this.destroy$ = new Subject<void>();
        }
        if (!this.events$) {
          this.events$ = new Subject<DataEvent>();
        }

        this.events$
          .pipe(
            filter((event: DataEvent) => propertyNames.includes(event.field)),
            takeUntil(this.destroy$),
          )
          .subscribe((event: DataEvent) => {
            this[propertyKey] = event.type === 'loading';
            markDirty(this);
          });

        if (originalInit) {
          originalInit.call(this);
        }
      },
      configurable: true,
    });

    const originalDestroy = target['ngOnDestroy']; // tslint:disable-line
    Object.defineProperty(target, 'ngOnDestroy', {
      value(): void {
        if (originalDestroy) {
          originalDestroy.call(this);
        }

        if (this.destroy$) {
          this.destroy$.next();
          this.destroy$.complete();
          this.destroy$ = null;
        }
      },
      configurable: true,
    });
  };
}
