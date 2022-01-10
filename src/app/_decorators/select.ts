import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DecoratorsService } from './decorators.service';

export function Select(selector: any): PropertyDecorator {
    return (target: any, propertyKey: PropertyKey): void => {
        const originalInit = target['ngOnInit']; // tslint:disable-line
        Object.defineProperty(target, 'ngOnInit', {
            value(): void {
                if (!this.destroy$) {
                    this.destroy$ = new Subject<void>();
                }

                const store = DecoratorsService.store;
                store.select(selector)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(value => this[propertyKey] = value);

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
