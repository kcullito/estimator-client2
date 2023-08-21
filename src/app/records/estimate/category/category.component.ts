import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { first } from 'rxjs';
import { Category } from 'src/app/_models/category.model';
import { RecordType } from 'src/app/_models/record-type.model';
import { RecordService } from 'src/app/_services/record.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
    category:               Category = new Category();
    selectedCategories:     Category[] = [];
    categoryDialog:         boolean = false;
    recordTypeDialog:       boolean = false;
    submitted:              boolean = false;
    categories:             Category[] = [];
    recordTypes:            RecordType[] = [];

    @ViewChild('dt') dt: Table | undefined;
    @ViewChild('dt2') dt2: Table | undefined;

    
    constructor(
        private recordService:          RecordService,
        private messageService:         MessageService, 
        private confirmationService:    ConfirmationService
    ) {}

    ngOnInit(): void {
        this.getCategories();
        this.getRecordTypes();
    }

    applyFilterGlobal($event, stringVal) {
        this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
      }

      applyLineItemFilterGlobal($event, stringVal) {
        this.dt2.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
      }

    /**
     * 
     */
    openNew() {
        this.category = new Category();
        this.resetRecordTypes();
        this.submitted = false;
        this.category.recordTypes = [];
        this.selectedCategories = [];
        this.categoryDialog = true;
    }

    /**
     * 
     */
    deleteSelectedCategories() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected categories?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.categories = this.categories.filter(val => !this.selectedCategories.includes(val));
                this.recordService.deleteSelectedCategories(this.selectedCategories).pipe(first()).subscribe(
                    response => {
                        this.getCategories();
                        this.selectedCategories = null;
                        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Categories Deleted', life: 3000});
                    }
                )
            }
        })
    }

    /**
     * 
     * @param category 
     */
    editCategory(category: Category) {
        this.category = {...category};
        // need to first clear the recordType selections
        this.recordTypes.forEach(selectedRecordType => {
            //console.log("resetting recordTypes");
            selectedRecordType.selected = false;
        });
        // now we need to select category records
        this.category.recordTypes.forEach(selectedRecordType => {
            this.recordTypes.forEach(recordType => {
                if (recordType.id === selectedRecordType.id) {
                    recordType.selected = true;
                }
            })
        })
        this.categoryDialog = true;
    }

    /**
     * 
     */
    getCategories() {
        this.recordService.getCategories().pipe(first()).subscribe(
            response => {
                this.categories = response.data.categories;
            }
        )
    }

    /**
     * 
     */
    saveCategory() {
        if (this.category.name.trim()) {
            if (this.category.id > 0) {
                this.recordService.updateCategory(this.category).pipe(first()).subscribe(
                    response => {
                        this.getCategories();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Category Updated', life: 3000 });
                    }
                )
            } else {
                this.recordService.saveCategory(this.category).pipe(first()).subscribe(
                    response => {
                        this.getCategories();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Category Added', life: 3000 });
                    }
                )
            }
        }
        this.hideDialog();
        this.category = new Category;
    }

    /**
     * 
     */
    hideDialog() {
        this.categoryDialog = false;
        this.submitted = false;
    }
    
    /**
     * 
     * @param category 
     * 
     */
    deleteCategory(category: Category) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + category.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.recordService.deleteCategory(category.id).pipe(first()).subscribe(
                    response => {
                        this.getCategories();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Category Deleted', life: 3000 });

                    }
                )
            }
        })
    }

    /**
     * 
     */
    getRecordTypes() {
        this.recordService.getRecordTypes().pipe(first()).subscribe(
            response => {
                this.recordTypes = <RecordType[]>response.data.recordTypes;
                this.recordTypes.forEach(recordType => {
                    recordType.selected = false;
                });
            }
        )
    }

    /**
     * Validate the form
     * 
     * calls saveCustomer if form is valid
     */
    validateForm() {
        this.submitted = true;
        if (
            this.category.name &&
            this.category.description
            ) {

            // clear the category.recordTypes array
            this.category.recordTypes = [];
            // loop through recordTypes and add selected items to category.recordTypes array
            this.recordTypes.forEach(rt =>{
                if (rt.selected) {
                    this.category.recordTypes.push(rt);
                }
            })

            this.saveCategory();
        }
    }

    /**
     * 
     */
    resetRecordTypes() {
        this.recordTypes.forEach(rt => {
            rt.selected = false;
        })
    }


}
