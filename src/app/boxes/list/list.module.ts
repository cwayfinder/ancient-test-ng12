import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListRoutingModule } from './list-routing.module';
import { ListComponent } from './list.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, ListRoutingModule, MatCardModule],
})
export class ListModule {}
