import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { Observable} from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  isAuth$: Observable<boolean>;

  @Output() closeSidenav = new EventEmitter<void>();

  constructor(private authService: AuthService, private store: Store<fromRoot.State>) { }

  ngOnInit(): void {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  onClose(){
    this.closeSidenav.emit();
  }

 onLogout(){
    this.authService.logout();
    this.onClose();
  }

}
