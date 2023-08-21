import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { first } from 'rxjs';
import { CostType } from 'src/app/_models/cost-type.model';
import { RecordService } from 'src/app/_services/record.service';

@Component({
  selector: 'app-cost-type',
  templateUrl: './cost-type.component.html',
  styleUrls: ['./cost-type.component.scss']
})
export class CostTypeComponent {
    costTypes:                  CostType[] = [];
    costType:                   CostType = new CostType();

    selectedCostTypes:          CostType[] = [];
    costTypeDialog:             boolean = false;
    submitted:                  boolean = false;

    @ViewChild('dt') dt: Table | undefined;

    constructor(
        private recordService:          RecordService,
        private messageService:         MessageService, 
        private confirmationService:    ConfirmationService
    ) { }

    ngOnInit(): void {
        this.getCostTypes();
    }

    applyFilterGlobal($event, stringVal) {
        this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
      }

    /**
     * 
     */
    openNew() {
        this.costType = new CostType();
        this.submitted = false;
        this.costTypeDialog = true;
    }

    /**
     * 
     */
    deleteSelectedCostTypes() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected cost types?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.costTypes = this.costTypes.filter(val => !this.selectedCostTypes.includes(val));
                this.recordService.deleteSelectedCostTypes(this.selectedCostTypes).pipe(first()).subscribe(
                    response => {
                        this.selectedCostTypes = null;
                        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Cost Types Deleted', life: 3000});        
                    }
                )

            }
        });
    }

    /**
     * 
     * @param costType 
     */
    editCostType(costType: CostType) {
        this.costType = {...costType};
        this.costTypeDialog = true;
    }

    /**
     * 
     */
    getCostTypes() {
        this.recordService.getCostTypes().pipe(first()).subscribe(
            response => {
                this.costTypes = response.data.costTypes;
            }
        )
    }

    /**
     * 
     */
    hideDialog() {
        this.costTypeDialog = false;
        this.submitted = false;
    }

    /**
     * Validate the form
     * 
     * calls saveCustomer if form is valid
     */
    validateForm() {
        this.submitted = true;
        if (
            this.costType.type &&
            this.costType.name &&
            this.costType.description
            ) {
            this.saveCostType();
        }
    }

    /**
     * 
     */
    saveCostType() {
        if (this.costType.name.trim()) {
            if (this.costType.id > 0) {
                this.recordService.updateCostType(this.costType).pipe(first()).subscribe(
                    response => {
                        this.getCostTypes();
                        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Cost Type Updated', life: 3000});
                    }
                )
            } else {
                this.recordService.saveCostType(this.costType).pipe(first()).subscribe(
                    response => {
                        this.getCostTypes();
                        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Cost Type Added', life: 3000});
                    }
                )
            }
        }
        this.hideDialog();
        this.costType = new CostType;
    }

    /**
     * 
     * @param costType 
     */
    deleteCostType(costType: CostType) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + costType.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.recordService.deleteCostType(costType.id).pipe(first()).subscribe(
                    response => {
                        this.getCostTypes();
                        this.hideDialog();
                        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Cost Type Deleted', life: 3000});
                    }
                )
            }
        })

    }

}
