import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { first } from 'rxjs';
import { Question } from 'src/app/_models/survey/question.model';
import { SurveyService } from 'src/app/_services/survey.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent {

    questions: Question[] = [];
    question: Question = new Question;
    questionDialog: boolean = false;
    submitted: boolean = false;

    @ViewChild('dt') dt: Table | undefined;

    constructor(
        private surveyService:          SurveyService,
        private messageService:         MessageService, 
        private confirmationService:    ConfirmationService,
    ) {}

    ngOnInit(): void {
        this.getQuestions();
    }

    applyFilterGlobal($event, stringVal) {
        this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }

    getQuestions() {
        this.surveyService.getQuestions().subscribe(
            (response) => {
                this.questions = response.data.questions;
            })
    }

    openNewQuestion() {
        this.question = new Question();
        this.submitted = false;
        this.questionDialog = true;
    }

    saveQuestion(question: Question) {
        if (question.id > 0) {
            // update survey
            this.surveyService.updateQuestion(question).pipe(first()).subscribe(
                response => {
                    this.getQuestions();
                }
            )
        } else {
            // create new survey
            this.surveyService.saveQuestion(question).pipe(first()).subscribe(
                response => {
                    this.getQuestions();
                }
            )
        }
    }

    editQuestion(question: Question) {
        this.question = {...question};
        this.questionDialog = true;
    }

    deleteQuestion(question: Question) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + question.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.surveyService.deleteQuestion(question.id).pipe(first()).subscribe(
                    response => {
                        this.getQuestions();
                        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Question Deleted', life: 3000});
                    }
                )
                
            }
        })
    }

    hideQuestionDialog() {
        this.questionDialog = false;
    }

    validateQuestionForm() {
        if (this.question.name && this.question.description) {
            this.saveQuestion(this.question);
            this.questionDialog = false;
        }
    }


}
