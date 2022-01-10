import { ChangeDetectionStrategy, Component, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { openBox, OpenBoxMutationResponseData } from '../../_graphql/open-box';
import { Box } from '../../_graphql/box';
import { Watch } from '../../_decorators/watch';
import { box } from 'src/app/_graphql/box';
import { Mutate } from '../../_decorators/mutate';
import { OnError } from 'src/app/_decorators/on-error';
import { OnSuccess } from '../../_decorators/on-success';
import { Loading } from '../../_decorators/loading';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent {
  @Watch(box) box!: Box;
  @Mutate(openBox) openBox = new EventEmitter<void>();
  @Loading('openBox') opening = false;

  constructor(private snackBar: MatSnackBar) {}

  open(): void {
    this.openBox.emit();
  }

  @OnSuccess('openBox')
  showConfirmation(data: OpenBoxMutationResponseData): void {
    if (data) {
      const item = data.openBox.boxOpenings[0].itemVariant;
      this.showNotification(`You found ${item.name} (${item.value})`);
    } else {
      this.showNotification('Something went wrong when opening the box');
    }
  }

  @OnError('openBox')
  showError(error: any): void {
    this.showNotification(error.message);
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 5000 });
  }
}
