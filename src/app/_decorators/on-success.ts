import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { DataErrorEvent, DataEvent, DataSuccessEvent } from './base';

export function OnSuccess(...propertyNames: string[]): MethodDecorator {
  return (target: any, methodName: PropertyKey): void => {
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
            filter((event: DataEvent) => event.type === 'success'),
            filter((event: DataSuccessEvent) => propertyNames.includes(event.field)),
            takeUntil(this.destroy$)
          )
          .subscribe((event: DataSuccessEvent) => target[methodName].call(this, event.data));

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
