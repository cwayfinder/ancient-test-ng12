import { RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';
import { RouterState } from './router-state';

export class CustomSerializer implements RouterStateSerializer<RouterState> {
    serialize(routerState: RouterStateSnapshot): RouterState {
        const path = [];
        let routeSnapshot = routerState.root;
        while (routeSnapshot.firstChild) {
            routeSnapshot = routeSnapshot.firstChild;
            path.push({ path: routeSnapshot.routeConfig?.path, lazy: !!routeSnapshot.routeConfig?.loadChildren });
        }
        const { url, root: { queryParams } } = routerState;
        const { params, data } = routeSnapshot;

        const route = '/' + path.map(segment => segment.path).filter(segment => !!segment).join('/');

        return { url, params, queryParams, route, data };
    }
}
