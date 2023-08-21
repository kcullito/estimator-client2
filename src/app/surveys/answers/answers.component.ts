import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { first } from 'rxjs';
import { Answer } from 'src/app/_models/survey/answer.model';
import { SurveyService } from 'src/app/_services/survey.service';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.scss']
})
export class AnswersComponent {

    answers: Answer[] = [];
    answer: Answer = new Answer;
    answerDialog: boolean = false;
    submitted: boolean = false;

    @ViewChild('dt') dt: Table | undefined;

    constructor(
        private surveyService:          SurveyService,
        private messageService:         MessageService, 
        private confirmationService:    ConfirmationService,
    ) {}

    ngOnInit(): void {
        this.getAnswers();
    }

    applyFilterGlobal($event, stringVal) {
        this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }

    getAnswers() {
        this.surveyService.getAnswers().subscribe(
            (response) => {
                this.answers = response.data.answers;
            })
    }

    openNewAnswer() {
        this.answer = new Answer();
        this.submitted = false;
        this.answerDialog = true;
    }

    saveAnswer(answer: Answer) {
        if (answer.id > 0) {
            // update survey
            this.surveyService.updateAnswer(answer).pipe(first()).subscribe(
                response => {
                    this.getAnswers();
                }
            )
        } else {
            // create new survey
            this.surveyService.saveAnswer(answer).pipe(first()).subscribe(
                response => {
                    this.getAnswers();
                }
            )
        }
    }

    editAnswer(answer: Answer) {
        this.answer = {...answer};
        this.answerDialog = true;
    }

    deleteAnswer(answer: Answer) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + answer.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.surveyService.deleteAnswer(answer.id).pipe(first()).subscribe(
                    response => {
                        this.getAnswers();
                        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Answer Deleted', life: 3000});
                    }
                )
                
            }
        })
    }

    hideAnswerDialog() {
        this.answerDialog = false;
    }

    validateAnswerForm() {
        if (this.answer.name && this.answer.description) {
            this.saveAnswer(this.answer);
            this.answerDialog = false;
        }
    }

}
