import { ChangeDetectionStrategy, Component, OnInit, ɵmarkDirty as markDirty } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OpenBoxGQL } from '../../_graphql/open-box';
import { Box, BoxGQL } from '../../_graphql/box';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent implements OnInit {
  boxId!: string;
  box$!: Observable<Box>;
  opening = false;

  constructor(private route: ActivatedRoute, private snackBar: MatSnackBar, private boxGQL: BoxGQL, private openBoxGQL: OpenBoxGQL) {}

  ngOnInit(): void {
    this.boxId = this.route.snapshot.params.boxId;

    this.box$ = this.boxGQL.fetch({ id: this.boxId }).pipe(map(result => result.data.box));
  }

  open(): void {
    this.opening = true;

    this.openBoxGQL
      .mutate({
        input: { boxId: this.boxId, amount: 1 },
      })
      .subscribe(
        result => {
          this.opening = false;
          markDirty(this);
          if (result.data) {
            const item = result.data.openBox.boxOpenings[0].itemVariant;
            this.showNotification(`You found ${item.name} (${item.value})`);
          } else {
            this.showNotification('Something went wrong when opening the box');
          }
        },
        error => {
          this.opening = false;
          markDirty(this);
          this.showNotification(error.message);
        },
      );
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 5000 });
  }
}
