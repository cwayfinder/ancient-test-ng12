import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Box } from '../../_graphql/boxes';
import { Watch } from '../../_decorators/watch';
import { boxes } from 'src/app/_graphql/boxes';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  @Watch(boxes) boxes!: Box[];
}
