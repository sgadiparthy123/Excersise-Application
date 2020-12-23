import { Component, OnInit} from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '.././exercise.model';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {
  
  excercises: Observable<any>;
  constructor(private trainingService: TrainingService, private db: AngularFirestore) { }

  ngOnInit(): void {
    this.excercises = this.db
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
        );
    
  }

  onStartTraining(form: NgForm){
    this.trainingService.startExercise(form.value.exercise);
  }

}
