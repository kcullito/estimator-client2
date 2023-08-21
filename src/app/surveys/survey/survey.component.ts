import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { first } from 'rxjs';
import { SurveySource } from 'src/app/_models/survey/survey-source.model';
import { Survey } from 'src/app/_models/survey/survey.model';
import { SurveyService } from 'src/app/_services/survey.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent {

    surveys: Survey[] = [];
    survey: Survey = new Survey();
    surveyDialog: boolean = false;

    sources: SurveySource[] = [];
    selectedSource: SurveySource;
    
    submitted: boolean = false;

    @ViewChild('dt') dt: Table | undefined;


    constructor(
        private surveyService:          SurveyService,
        private messageService:         MessageService, 
        private confirmationService:    ConfirmationService,

    ) {}

    ngOnInit(): void {
        //this.getSurveys();
        this.getSources();
    }

    applyFilterGlobal($event, stringVal) {
        this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }

    getSurveys() {
        this.surveyService.getSurveys().subscribe(
            (response) => {
                this.surveys = response.data.surveys;

                this.surveys.forEach(survey => {
                    this.sources.forEach(source => {
                        if (survey.source === source.id) {
                            survey.source = source.id;
                            survey.sourceName = source.name;
                        }
                    })
                })
            })
    }

    getSources() {
        this.surveyService.getSurveySources().subscribe(
            (response) => {
                this.sources = response.data.sources;
                this.getSurveys();
            })
    }


    openNewSurvey() {
        this.survey = new Survey();
        this.submitted = false;
        this.surveyDialog = true;
    }

    saveSurvey(survey: Survey) {
        survey.source = this.selectedSource.id;
        survey.sourceName = this.selectedSource.name;
        if (survey.id > 0) {
            // update survey
            this.surveyService.updateSurvey(survey).pipe(first()).subscribe(
                response => {
                    this.getSurveys();
                }
            )
        } else {
            // create new survey
            this.surveyService.saveSurvey(survey).pipe(first()).subscribe(
                response => {
                    this.getSurveys();
                }
            )
        }
    }


    editSurvey(survey: Survey) {
        this.survey = {...survey};
        this.surveyDialog = true;
    }

    deleteSurvey(survey: Survey) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + survey.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.surveyService.deleteSurvey(survey.id).pipe(first()).subscribe(
                    response => {
                        this.getSurveys();
                        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Survey Deleted', life: 3000});
                    }
                )
                
            }
        })


    }

    hideSurveyDialog() {
        this.surveyDialog = false;
    }

    validateSurveyForm() {

        if (this.survey.name && this.survey.description) {
            this.saveSurvey(this.survey);
            
            this.surveyDialog = false;

        }

    }

    viewSurvey(survey: Survey) {

    }


}
