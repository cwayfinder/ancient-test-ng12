import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Box, BoxesGQL } from '../../_graphql/boxes';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
  boxes$!: Observable<Box[]>;

  constructor(private boxesGQL: BoxesGQL) {}

  ngOnInit() {
    this.boxes$ = this.boxesGQL.fetch().pipe(map(result => result.data.boxes.edges.map(edge => edge.node)));
  }
}
