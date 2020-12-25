import { Component, OnDestroy, OnInit} from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '.././exercise.model';
import { NgForm } from '@angular/forms';

import { Subscription } from 'rxjs';



@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  
  excercises: Exercise[];
  exerciseSubscription: Subscription;
  constructor(private trainingService: TrainingService) { }
  
  ngOnDestroy(): void {
    this.exerciseSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises => {
      this.excercises = exercises
    });
    this.trainingService.fetchAvailableExercises();
    
  }

  onStartTraining(form: NgForm){
    this.trainingService.startExercise(form.value.exercise);
  }

}
