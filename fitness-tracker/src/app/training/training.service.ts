import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Exercise } from './exercise.model';
import { Subscription } from 'rxjs';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as fromTraining from './training.reducer';
import * as Training from './training.actions';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

@Injectable()
export class TrainingService {
   
  private fbSubs: Subscription[] = [];
    
  constructor(private db: AngularFirestore, 
        private uiService: UIService,
        private store: Store<fromTraining.State>){}

    fetchAvailableExercises() {
        this.store.dispatch(new UI.StartLoading());
        this.fbSubs.push(this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map(docArray => {
            return docArray.map(doc => {
              const data: any = doc.payload.doc.data();
              return {
                id: doc.payload.doc.id,
                ...data
              }
            })
          })  
        ).subscribe((exercises: Exercise[])=>{
            this.store.dispatch(new UI.StopLoading());
            this.store.dispatch(new Training.SetAvailableTrainings(exercises));
        }, error => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar('Fetching Exercises failed, Please try again', null, 3000);
            
        }));
    }

    startExercise(selectedId: string) {
        this.store.dispatch(new Training.StartTraining(selectedId));
    }

   completeExercise() {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
              ...ex,
              date: new Date(),
              state: 'completed'
            });
            this.store.dispatch(new Training.StopTraining());
          });
    }

    cancelExercise(progress: number) {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
              ...ex,
              duration: ex.duration * (progress / 100),
              calories: ex.calories * (progress / 100),
              date: new Date(),
              state: 'cancelled'
            });
            this.store.dispatch(new Training.StopTraining());
          });
    }

    fetchCompletedOrCanceledExercises(){
        this.fbSubs.push(this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
            this.store.dispatch(new Training.SetFinishedTrainings(exercises));
        }));
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }

    cancelSubscriptions(){
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }
}