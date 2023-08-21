import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { first } from 'rxjs';
import { SurveySource } from 'src/app/_models/survey/survey-source.model';
import { SurveyService } from 'src/app/_services/survey.service';

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss']
})
export class SourcesComponent {

    sources: SurveySource[] = [];
    source: SurveySource = new SurveySource;

    sourceDialog: boolean = false;

    submitted: boolean = false;


    @ViewChild('dt') dt: Table | undefined;


    constructor(
        private surveyService:          SurveyService,
        private messageService:         MessageService, 
        private confirmationService:    ConfirmationService,

    ) {}

    ngOnInit(): void {
        this.getSources();
    }

    applyFilterGlobal($event, stringVal) {
        this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }

    getSources() {
        this.surveyService.getSurveySources().subscribe(
            (response) => {
                this.sources = response.data.sources;
            })
    }

    openNewSource() {
        this.source = new SurveySource();
        this.submitted = false;
        this.sourceDialog = true;
    }

    saveSource(source: SurveySource) {
        if (source.id > 0) {
            // update survey
            this.surveyService.updateSurveySource(source).pipe(first()).subscribe(
                response => {
                    this.getSources();
                }
            )
        } else {
            // create new survey
            this.surveyService.saveSurveySource(source).pipe(first()).subscribe(
                response => {
                    this.getSources();
                }
            )
        }
    }


    editSource(source: SurveySource) {
        this.source = {...source};
        this.sourceDialog = true;
    }

    deleteSource(source: SurveySource) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + source.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.surveyService.deleteSurveySource(source.id).pipe(first()).subscribe(
                    response => {
                        this.getSources();
                        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Source Deleted', life: 3000});
                    }
                )
                
            }
        })


    }

    hideSourceDialog() {
        this.sourceDialog = false;
    }

    validateSourceForm() {

        if (this.source.name && this.source.description) {
            this.saveSource(this.source);
            
            this.sourceDialog = false;

        }

    }


}
