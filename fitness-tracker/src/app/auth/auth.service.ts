import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { AngularFireAuth} from 'angularfire2/auth';
import { TrainingService } from '../training/training.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UIService } from '../shared/ui.service';

@Injectable()
export class AuthService{
    private isAuthenticated= false;
    authChange = new Subject<boolean>();

    constructor(private router: Router, private afAuth:AngularFireAuth, 
        private trainingService: TrainingService,
        private snackBar: MatSnackBar,
        private uiService: UIService){}
    
    initAuthListener(){
        this.afAuth.authState.subscribe(user => {
            if(user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigate(['/training']);
            }else {
                this.trainingService.cancelSubscriptions();
                this.authChange.next(false);
                this.router.navigate(['/login']);
                this.isAuthenticated = false;
            }
        });
    }

    registerUser(authData: AuthData){
      this.uiService.loadingStateChanged.next(true);
      this.afAuth.auth.createUserWithEmailAndPassword(authData.email,
        authData.password).then(result => {
        this.uiService.loadingStateChanged.next(false);
        }).catch(error =>{
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar(error.message, null, 3000);
            
        });
        
    }

    login(authData: AuthData){
      this.uiService.loadingStateChanged.next(true);
      this.afAuth.auth.signInWithEmailAndPassword(authData.email,
        authData.password).then(result => {
            this.uiService.loadingStateChanged.next(false);
          }).catch(error =>{
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar(error.message, null, 3000);
        });
       
    }

    logout(){
        this.afAuth.auth.signOut();
    }

  isAuth(){
        return this.isAuthenticated;
    }
}