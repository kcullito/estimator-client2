import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { first } from 'rxjs';
import { EstimateStatus } from 'src/app/_models/estimate-status.model';
import { EstimateService } from 'src/app/_services/estimate.service';

@Component({
  selector: 'app-estimate-status',
  templateUrl: './estimate-status.component.html',
  styleUrls: ['./estimate-status.component.scss']
})
export class EstimateStatusComponent {
    estimateStatuses:           EstimateStatus[] = [];
    estimateStatus:             EstimateStatus;
    selectedEstimateStatuses:   EstimateStatus[] = [];
    estimateStatusDialog:       boolean = false;
    submitted:                  boolean = false;

    @ViewChild('dt') dt: Table | undefined;

    constructor(
        private estimateService:        EstimateService,
        private messageService:         MessageService, 
        private confirmationService:    ConfirmationService
    ) { }

    ngOnInit(): void {
        this.getEstimateStatuses();
    }

    applyFilterGlobal($event, stringVal) {
        this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }

    /**
     * 
     */
    getEstimateStatuses() {
        this.estimateService.getEtimateStatuses().pipe(first()).subscribe(
            response => {
                this.estimateStatuses = <EstimateStatus[]>response.data.estimateStatuses;

                // order the statuses
                this.sortStatuses();
            }
        )
    }

    /**
     * 
     */
    openNew() {
        this.estimateStatus = new EstimateStatus();
        this.submitted = false;
        this.estimateStatusDialog = true;

    }

    /**
     * Validate the form
     * 
     * calls saveStatus if form is valid
     */
    validateForm() {
        this.submitted = true;
        if (
            this.estimateStatus.statusDescription &&
            this.estimateStatus.statusName) {
                
                this.saveStatus();
        }
    }
    

    /**
     * 
     */
    saveStatus() {
        if (this.estimateStatus.id > 0) {
            this.estimateService.updateEstimateStatus(this.estimateStatus).pipe(first()).subscribe(
                response => {
                    this.getEstimateStatuses();
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Estimate Status Updated', life: 3000});
                }
            )
        } else {
            this.estimateService.saveEstimateStatus(this.estimateStatus).pipe(first()).subscribe(
                response => {
                    this.getEstimateStatuses();
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Estimate Status Created', life: 3000});
                }
            )
        }
        this.hideDialog();
        this.estimateStatus = new EstimateStatus();
    }

    /**
     * 
     * @param estimateStatus 
     */
    editStatus(estimateStatus:EstimateStatus) {
        this.estimateStatus = {...estimateStatus};
        this.estimateStatusDialog = true;
    }

    /**
     * 
     * @param estimateStatus 
     */
    deleteStatus(estimateStatus: EstimateStatus) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + estimateStatus.statusName + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.estimateService.deleteEstimateStatus(estimateStatus.id).pipe(first()).subscribe(
                    response => {
                        this.getEstimateStatuses();
                    }
                )
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Estimate Status Deleted', life: 3000});
            }
        })
    }

    /**
     * Delete selected estimate statuses
     */
    deleteSelectedEstimateStatuses() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected estimate statuses?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.estimateStatuses = this.estimateStatuses.filter(val => !this.selectedEstimateStatuses.includes(val));
                this.estimateService.deleteSelectedEstimateStatuses(this.selectedEstimateStatuses).pipe(first()).subscribe(
                    response => {
                        this.getEstimateStatuses();
                        this.selectedEstimateStatuses = null;
                    }
                )
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Etimated Statuses Deleted', life: 3000});
            }
        });
    }
    

    /**
     * Hide the new/edit dialog
     */
    hideDialog() {
        this.estimateStatusDialog = false;
        this.submitted = false;
    }

    /**
     * User reordered the categories 
     * 
     * @param event 
     */
    rowChanged(event) {
        let index = 0;
        this.estimateStatuses.forEach(estimateStatus => {
            estimateStatus.pos = index++;
            this.estimateService.updateEstimateStatus(estimateStatus).pipe(first()).subscribe(
                response => {
                    console.log("saved status " + estimateStatus.statusName);
                }
            )
        })
    }

    /**
     * Sorts the categories based on the pos field
     */
    sortStatuses() {
        this.estimateStatuses.sort((a, b) => a.pos - b.pos);
    }
    
    

}
