import { Component, OnInit} from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '.././exercise.model';
import { NgForm } from '@angular/forms';
import { Observable} from 'rxjs';
import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';



@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit{
  
  excercises$: Observable<Exercise[]>;
  isLoading$ : Observable<boolean>;
  constructor(private trainingService: TrainingService,
    private store: Store<fromTraining.State>) { }
  
 

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.excercises$ = this.store.select(fromTraining.getAvailableExercises);
      this.fetchExercises();
    }

    fetchExercises(){
      this.trainingService.fetchAvailableExercises();
    }

  onStartTraining(form: NgForm){
    this.trainingService.startExercise(form.value.exercise);
  }

}
