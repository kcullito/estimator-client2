import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { first } from 'rxjs';
import { Category } from 'src/app/_models/category.model';
import { CostType } from 'src/app/_models/cost-type.model';
import { RecordType } from 'src/app/_models/record-type.model';
import { RecordService } from 'src/app/_services/record.service';

@Component({
  selector: 'app-record-type',
  templateUrl: './record-type.component.html',
  styleUrls: ['./record-type.component.scss']
})
export class RecordTypeComponent {
    recordTypes:                RecordType[] = [];
    selectedCategories:         Category[] = [];
    costTypes:                  CostType[] = [];
    recordType:                 RecordType = new RecordType();
    selectedRecordTypes:        RecordType[] = [];
    recordTypeDialog:           boolean = false;
    submitted:                  boolean = false;
    productLinksDialog:         boolean = false;
//    productLinks:               ProductLink[] = [];
//    productLink:                ProductLink = new ProductLink();

    assignedCategoriesDialog:   boolean = false;

    @ViewChild('dt') dt: Table | undefined;

    constructor(
        private recordService:          RecordService,
        private messageService:         MessageService, 
        private confirmationService:    ConfirmationService
    ) {}

    ngOnInit(): void {
        this.getRecordTypes();
        this.getCostTypes();
    }

    /**
     * 
     */
    openNew() {
        this.recordType = new RecordType();
        this.submitted = false;
        this.recordTypeDialog = true;
    }

    applyFilterGlobal($event, stringVal) {
        this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }

    /**
     * 
     * @param recordType 
     */
    editRecordType(recordType: RecordType) {
        this.recordType = {...recordType};
        this.recordTypeDialog = true;
    }

    /**
     * 
     * @param recordType 
     */
    deleteRecordType(recordType: RecordType) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + recordType.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {

            this.recordService.deleteRecordType(recordType.id).pipe(first()).subscribe(
                response => {
                    this.getRecordTypes();
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Line Item Deleted', life: 3000});
                })
            }
        })
    }

    /**
     * 
     */
    deleteSelectedRecordTypes() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected line items?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.recordTypes = this.recordTypes.filter(val => !this.selectedRecordTypes.includes(val));
                this.recordService.deleteRecordTypes(this.selectedRecordTypes).pipe(first()).subscribe(
                    response => {
                        this.selectedRecordTypes = [];
                        this.getRecordTypes();
                        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Line Items Deleted', life: 3000});
                    }
                )
            }
        })
    }

    /**
     * 
     */
    hideDialog() {
        this.recordTypeDialog = false;
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
            this.recordType.costTypeId &&
            this.recordType.name &&
            this.recordType.description &&
            this.recordType.cost
            ) {
                this.saveRecordType();
        }
    }

    /**
     * 
     */
    saveRecordType() {
        if (this.recordType) {
            if (this.recordType.id > 0) {
                this.recordService.updateRecordType(this.recordType).pipe(first()).subscribe(
                    response => {
                        this.getRecordTypes();
                        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Line Item Updated', life: 3000});
                    }
                )
            } else {
                this.recordService.saveRecordType(this.recordType).pipe(first()).subscribe(
                    response => {
                        this.getRecordTypes();
                        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Line Item Added', life: 3000});

                    }
                ), 
                error => this.messageService.add({severity:'error', summary: 'Error', detail: error, life: 3000}),
                () => console.log("Record saved successfully");
            }
            this.hideDialog();
            this.recordType = new RecordType;

        }
    }

    /**
     * 
     */
    getRecordTypes() {
        this.recordService.getRecordTypes().pipe(first()).subscribe(
            response => {
                this.recordTypes = response.data.recordTypes;
            }
        )
    }
    
    /**
     * Retrieve the CostType objects to populate a dropdown
     */
    getCostTypes() {
        this.recordService.getCostTypes().pipe(first()).subscribe(
            response => {
                this.costTypes = response.data.costTypes;
            }
        )
    }

    /**
     * Get the CostType object associated with 
     *  the selected RecordType object
     * 
     * @param id 
     * @returns 
     */
    getCostTypeValue(id: number): string {
        let costTypeName = "";
        this.costTypes.forEach(costType => {
            if (costType.id === id) {
                costTypeName = costType.description;
            }
        })
        return costTypeName;

    }

    getCategoriesForRecordType(recordType: RecordType) {
        this.selectedCategories = [];
        this.recordService.getCategories().pipe(first()).subscribe(
            response => {
                let categories = response.data.categories;
                categories.forEach(category => {
                    let addRecord = false;
                    category.recordTypes.forEach(rt => {
                        if (rt.id === recordType.id) {
                            addRecord = true;
                        }
                    })
                    if (addRecord) {
                        this.selectedCategories.push(category);
                        
                        addRecord = false;
                    }
                })
                console.log("getCategoresForRecordType:total:" + this.selectedCategories.length);
                if (this.selectedCategories.length < 1) {
                    this.deleteRecordType(recordType);
                } else {
                    this.assignedCategoriesDialog = true;
                    console.log("This Line Item is assigned to the following Categories:");
                    this.selectedCategories.forEach(category => {
                        console.log("getCategoresForRecordType:found:" + category.name);
                    }) 
                }

            }
        )
    }



}
