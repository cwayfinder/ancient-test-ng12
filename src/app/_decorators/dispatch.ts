import { ActionCreator } from '@ngrx/store/src/models';
import { Subject } from 'rxjs';
import { DecoratorsService } from './decorators.service';
import { takeUntil } from 'rxjs/operators';

export function Dispatch(actionCreator: ActionCreator<any, (props: any) => any>): PropertyDecorator {
    return (target: any, propertyKey: PropertyKey): void => {
        const originalInit = target['ngOnInit']; // tslint:disable-line
        Object.defineProperty(target, 'ngOnInit', {
            value(): void {
                if (!this.destroy$) {
                    this.destroy$ = new Subject<void>();
                }

                const store = DecoratorsService.store;
                this[propertyKey]
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((params: any) => store.dispatch(actionCreator(params)));

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
