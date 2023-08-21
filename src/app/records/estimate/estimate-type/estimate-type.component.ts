import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { first } from 'rxjs';
import { Category } from 'src/app/_models/category.model';
import { EstimateType } from 'src/app/_models/estimate-type.model';
import { RecordService } from 'src/app/_services/record.service';

@Component({
  selector: 'app-estimate-type',
  templateUrl: './estimate-type.component.html',
  styleUrls: ['./estimate-type.component.scss']
})
export class EstimateTypeComponent {
    estimateTypes:              EstimateType[] = [];
    selectedEstimateTypes:      EstimateType[] = [];
    categories:                 Category[] = [];

    submitted:                  boolean = false;
    estimateTypeDialog:         boolean = false;

    displayedColumns:           string[] = ['name', 'description'];
    categoryDisplayedColumns:   string[] = ['select','name', 'description'];
//    dataSource = this.estimateTypes;

    disableListButtons:         boolean = true;
    estimateType: EstimateType = new EstimateType();
    selectedEstimateType: EstimateType = new EstimateType();

    highlightedRow: number;
    isSelected: boolean;
    updateRecord: boolean = false;

    saveButtonTitle: string = "Save";
    estimateTypeTitle: string = "Add Estimate Type";

    checked: boolean = false;
    showDialog: boolean = false;

    @ViewChild('dt') dt: Table | undefined;
    @ViewChild('dt2') dt2: Table | undefined;

    constructor(
        private recordService: RecordService,
        //private dialog: MatDialog,
        private messageService: MessageService, 
        private confirmationService: ConfirmationService

    ) {}

    ngOnInit(): void {
        this.getEstimateTypes();
        this.getCategories();
    }

    applyFilterGlobal($event, stringVal) {
        this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }

    applyCategoryFilterGlobal($event, stringVal) {
        this.dt2.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
      }


      openNew() {
        this.estimateType = new EstimateType();
        this.resetCategories();
        this.submitted = false;
        this.estimateTypeDialog = true;
    }

    /**
     * 
     */
    deleteSelectedEstimateTypes() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected estimate types?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.estimateTypes = this.estimateTypes.filter(val => !this.selectedEstimateTypes.includes(val));
                this.recordService.deleteSelectedEstimateTypes(this.selectedEstimateTypes).pipe(first()).subscribe(
                    response => {
                        this.getEstimateTypes();
                        this.selectedEstimateTypes = null;
                        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Etimated Types Deleted', life: 3000});
                    }
                )
            }
        });
    }

    /**
     * 
     * @param estimateType 
     */
    deleteEstimateType(estimateType: EstimateType) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + estimateType.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.recordService.deleteEstimateType(estimateType.id).pipe(first()).subscribe(
                    response => {
                        this.getEstimateTypes();
                        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Estimate Type Deleted', life: 3000});
                    }
                )
            }
        })

    }


    /**
     * Retrieve EstimateType objects from API
     * 
     */
    getEstimateTypes() {
        this.recordService.getEstimateTypes().pipe(first()).subscribe(
            response => {
                this.estimateTypes = response.data.estimateTypes;
            }
        )
    }

    /**
     * 
     * @param estimateType 
     */
    editEstimateType(estimateType: EstimateType) {
        this.estimateType = {...estimateType};
        this.estimateTypeDialog = true;

        this.resetCategories();
        // need to first clear the recordType selections
        //this.categories.forEach(selectedCategory => {
        //    selectedCategory.selected = false;
        //});
        // now we need to select category records
        this.estimateType.categories.forEach(selectedCategory => {
            this.categories.forEach(category => {
                if (category.id === selectedCategory.id) {
                    category.selected = true;
                }
            })
        })
    }

    /**
     * Get Category objects
     */
    getCategories() {
        this.recordService.getCategories().pipe(first()).subscribe(
            response => {
                this.categories = response.data.categories;
                this.categories.forEach(category => {
                    console.log("category:" + category.name);
                    category.selected = false;
                });
            }
        )
    }
    
    /**
     * 
     */
    hideDialog() {
        this.estimateTypeDialog = false;
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
            this.estimateType.name &&
            this.estimateType.description
            ) {
                // clear the category.recordTypes array
                this.estimateType.categories = [];
                // loop through recordTypes and add selected items to category.recordTypes array
                this.categories.forEach(cat =>{
                    if (cat.selected) {
                        this.estimateType.categories.push(cat);
                    }
                })
                
                this.saveEstimateType();
        }
    }

    /**
     * 
     */
    saveEstimateType() {
        if (this.estimateType.name.trim()) {
            if (this.estimateType.id > 0) {
                this.recordService.updateEstimatedType(this.estimateType).pipe(first()).subscribe(
                    response => {
                        this.getEstimateTypes();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Estimate Type Updated', life: 3000 });
                    }
                )
            } else {
                this.recordService.saveEstimateType(this.estimateType).pipe(first()).subscribe(
                    response => {
                        this.getEstimateTypes();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Estimate Type Created', life: 3000 });
                    }
                )
            }
        }
        this.hideDialog();
        this.estimateType = new EstimateType;
    }

    /**
     * 
     */
    showCategories() {
        this.selectedEstimateType.categories.forEach(selectedCategory => {
            this.categories.forEach(category => {
                if (category.id === selectedCategory.id) {
                    category.selected = true;
                }
            })
        })
        this.showDialog = true;
    }
    
    /**
     * 
     */
    resetCategories() {
        this.getCategories;
        this.categories.forEach(cat => {
            cat.selected = false;
        })
    }

}
