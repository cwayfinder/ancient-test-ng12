import { Data, Params } from '@angular/router';

export interface RouterState {
    url: string;
    params: Params;
    queryParams: Params;
    route: string;
    data: Data;
}
