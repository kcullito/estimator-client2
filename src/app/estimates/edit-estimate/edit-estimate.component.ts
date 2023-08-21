import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { first } from 'rxjs';
import { Category } from 'src/app/_models/category.model';
import { Company } from 'src/app/_models/company.model';
import { CostType } from 'src/app/_models/cost-type.model';
import { Customer } from 'src/app/_models/customer.model';
import { EstimateDetail } from 'src/app/_models/estimate-detail.model';
import { EstimateStatus } from 'src/app/_models/estimate-status.model';
import { EstimateType } from 'src/app/_models/estimate-type.model';
import { Estimate } from 'src/app/_models/estimate.model';
import { LineCategory } from 'src/app/_models/line-category.model';
import { LineItem } from 'src/app/_models/line-item.model';
import { RecordType } from 'src/app/_models/record-type.model';
import { User } from 'src/app/_models/user.model';
import { CompanyService } from 'src/app/_services/company.service';
import { CustomerService } from 'src/app/_services/customer.service';
import { EstimateService } from 'src/app/_services/estimate.service';
import { RecordService } from 'src/app/_services/record.service';
import { ScraperService } from 'src/app/_services/scraper.service';
import { StorageService } from 'src/app/_services/storage.service';

@Component({
  selector: 'app-edit-estimate',
  templateUrl: './edit-estimate.component.html',
  styleUrls: ['./edit-estimate.component.scss']
})
export class EditEstimateComponent {
    estimate:                   Estimate = new Estimate;
    categories:                 Category[] = [];
    recordTypes:                RecordType[] = [];
    submitted:                  boolean = false;
    company:                    Company;

    customers:                  Customer[] = [];
    customer:                   Customer;
    selectedCustomer:           Customer = new Customer;
    showDescription:            boolean;

    estimateTypes:              EstimateType[] = [];
    estimateStatuses:           EstimateStatus[] = [];
    estimateVersions:           number[] = [];

    selectedEstimateType:       EstimateType;
    populateItems:              boolean = true;
    selectedEstimateStatus:     EstimateStatus = new EstimateStatus();

    pageTitle:                  string = "Create New Estimate";

    estimateDetails:            EstimateDetail[] = [];
    estimateDetail:             EstimateDetail = new EstimateDetail;

    lineItems:                  LineItem[] = [];
    lineCategories:             LineCategory[] = [];

    selectedCategoryId:         number = 0;
    selectedRecordTypeId:       number = 0;
    selectedEstimateId:         number = 0;
    selectedVersion:            number = 1;

    addCategoryDialog:          boolean = false;
    addLineItemDialog:          boolean = false;
    addNewCategoryDialog:       boolean = false;
    addNewLineItemDialog:       boolean = false;
//    addNewRecordTypeDialog: boolean = false;

    newCategory:                Category = new Category;
    newRecordType:              RecordType = new RecordType;

    costTypes:                  CostType[] = [];
    currentUser:                User = new User();
    salesTax:                   number = 0;

    debug:                      boolean = false;
    isCurrentVersion:           boolean = false;
//    includeAdmin:               boolean = false;

    @ViewChild('dt') dt:        Table | undefined;


    constructor(
        private estimateService:    EstimateService,
        private recordService:      RecordService,
        private customerService:    CustomerService,
        private scraperService:     ScraperService,
        private router:             Router,
        private messageService:     MessageService,
        private route:              ActivatedRoute,
        private storage:            StorageService,
        private companyService:     CompanyService,
    ) { }

    ngOnInit(): void {
        this.currentUser = this.storage.getUser();

        this.route.params.subscribe((params) => {
            let id = params['id'];
            if (id !== undefined && id > 0) {
                this.selectedEstimateId = id;
                //this.editing = true;
            } else {
                this.selectedVersion = 1;
                this.estimate.currentVersion = 1;
                this.isCurrentVersion = true;
                this.estimateVersions.push(this.estimate.currentVersion);

            }
        });

        this.getEtimateTypes();
        this.getCategories();
        this.getCompany();
    }

    applyFilterGlobal($event, stringVal) {
        this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
      }

    /**
     * 1. get estimate types first, then call getCustomers
     * 
     */
    getEtimateTypes() {
        if (this.debug) {
            console.log("getEstimateTypes");
        }
        this.recordService.getEstimateTypes().pipe(first()).subscribe(
            response => {
                this.estimateTypes = <EstimateType[]>response.data.estimateTypes;
                this.getCustomers();
            }
        )
    }
    
    /**
     * 2. get customers then call getEstimateStatuses
     * 3. call getEstimate if an id was passed in from the calling component
     * 3. otherwise call getVersions to populate the version dropdown
     * 
     * Used to populate the Customer dropdown list
     */
    getCustomers() {
        if (this.debug) {
            console.log("getCustomers");
        }
        this.customerService.getCustomers().pipe(first()).subscribe(
            response => {
                this.customers = <Customer[]>response.data.customers;
                
                this.getEstimateStatuses();
                // get existing estimate
                if (this.selectedEstimateId != undefined && this.selectedEstimateId > 0) {
                    this.getEstimate(this.selectedEstimateId);
                } else {
                    this.getVersions();
                }
            }
        )
    }
    
    /**
     * 4. get the estimate from the database using the passed in id
     * 5. then call populateExistingEstimate
     * 
     * @param id 
     */
    getEstimate(id: number) {
        if (this.debug) {
            console.log("getEstimate:id" + id);
        }
        if (id > 0) {
            this.estimateVersions = [];
            this.estimateService.getEstimate(id).pipe(first()).subscribe(
                response => {
                    this.estimate = response.data.estimate;
                    this.pageTitle = "Edit Estimate";
                    this.estimate.estimateDetails.forEach(estimateDetail => {
                        this.estimateVersions.push(estimateDetail.version);

                        if (this.estimate.currentVersion === estimateDetail.version) {
                            this.estimateDetail = estimateDetail;
                            this.selectedVersion = this.estimate.currentVersion;

                            if (this.estimate.adminMessage === null || this.estimate.adminMessage.length < 1) {
                                this.estimate.adminMessage = this.company.adminMessage;
                            }
                            if (this.estimate.adminPercent === undefined || this.estimate.adminPercent < 1) {
                                this.estimate.adminPercent = this.company.adminPercent;
                            }                            

                            if (this.estimate.currentVersion === estimateDetail.version) {
                                this.isCurrentVersion = true;
                            } else {
                                this.isCurrentVersion = false;
                            }
                        }
                    })

                    this.populateItems = false;
                    this.calculateTotals();
                    this.populateExistingEstimate();
                }
            )
        }
    }

    addAdmin(event) {
        //console.log("addAdmin button clicked!" + this.estimate.includeAdmin);
        //this.includeAdmin = event.checked;
        //this.estimate.includeAdmin = this.includeAdmin;
        if (this.estimate.includeAdmin) {
            this.addAdminCategory();
        } else {
            // remove adminCategory
        }

    }

    /**
     * Populate the EstimateTypes dropdown list
     */
    getCategories() {
        if (this.debug) {
            console.log("getCategories");
        }
        this.recordService.getCategories().pipe(first()).subscribe(
            response => {
                this.categories = <Category[]>response.data.categories;
                this.getRecordTypes();
            }
        )
    }

    /**
     * Get RecordType (LineItem) opbjects use in the line items
     */
    getRecordTypes() {
        if (this.debug) {
            console.log("getRecordTypes");
        }
        this.recordService.getRecordTypes().pipe(first()).subscribe(
            response => {
                this.recordTypes = <RecordType[]>response.data.recordTypes;
                this.getCostTypes();
            }
        )
    }

    getVersions() {
        if (this.debug) {
            console.log("getVersions");
        }
        if (this.estimate && this.estimate.estimateDetails) {
            this.estimateVersions = [];
            this.estimate.estimateDetails.forEach(estimateDetail => {
                //console.log("getVersions:estimateDetail:version:" + estimateDetail.version);
                this.estimateVersions.push(estimateDetail.version);
            })
        }
    }

    /**
     * 
     */
    populateExistingEstimate() {
        if (this.debug) {
            console.log("populateExistingEstimate");
        }
        // get the selected customer and set the Customer dropdown value
        this.customers.forEach( customer => {
            if (customer.id === this.estimate.customerId) {
                this.selectedCustomer = customer;
            }
        });

    }

    /**
     * 
     */
    saveEstimate() {
        if (this.debug) {
            console.log("saveEstimate");
        }
        this.submitted = true;

        if (this.selectedCustomer.id > 0 &&
            this.estimate.estimateTypeId &&
            this.estimate.estimateName &&
            this.estimateDetail.description) {

            this.estimate.customerId = this.selectedCustomer.id;

            this.estimate.updated =  new Date();
            this.estimateDetail.updated = this.estimate.updated;
            this.estimate.includeTitlePage = true;

            this.estimate.userId =  this.currentUser.id;

            if (this.estimateDetail.statusId === undefined || this.estimateDetail.statusId < 1) {
                this.estimateStatuses.forEach(status => {
                    if (status.statusName === "Draft") {
                        this.estimateDetail.statusId = status.id;
                    }
                });
            }

            if (this.selectedVersion == undefined || this.selectedVersion < 1) {
                this.estimateDetail.version = 1;
                this.selectedVersion = 1;

            } else {
                this.estimateDetail.version = this.selectedVersion;
            }

            this.estimateDetail.customerId = this.selectedCustomer.id;
            
            if (this.isCurrentVersion) {
                this.estimate.currentVersion = this.estimateDetail.version;
            }

            /**
             * update an existing estimate
             */
            if (this.estimate.id > 0) {
                this.estimateService.updateEstimate(this.estimate).pipe(first()).subscribe(
                    response => {
                        this.router.navigate(['estimates']);
                    }
                )
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Estimate Saved', life: 3000 });
            
            /**
             * save a new estimate
             */
            } else {

                this.estimate.estimateDetails = [];
                this.estimate.estimateDetails.push(this.estimateDetail);
                this.estimate.userId =  this.currentUser.id;

                this.estimateService.saveEstimate(this.estimate).pipe(first()).subscribe(
                    response => {
                        this.router.navigate(['estimates']);
                    }
                )

                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Estimate Saved', life: 3000 });
            }
        }
    }

    /**
     * save a new category from popup form
     * 
     * @param category 
     */
    saveCategory(category: Category) {
        if (this.debug) {
            console.log("saveCategory");
        }
        this.recordService.saveCategory(category).pipe(first()).subscribe(
            response => {
                let category: Category = response.data.category;
                this.estimateDetail.lineCategories.push(this.getLineCategoryFromCategory(category));
                this.estimateDetail.lineCategories = this.estimateDetail.lineCategories;
        });
    }

    /**
     * save a new category from popup form
     * 
     * @param category 
     */
    updateCategory(category: Category) {
        if (this.debug) {
            console.log("updateCategory");
        }
        this.recordService.updateCategory(category).pipe(first()).subscribe(
            response => {
                //this.getCategories();
                this.getRecordTypes();
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Line Item Updated', life: 3000 });
        });
    }

    saveRecordType(recordType: RecordType) {
        if (this.debug) {
            console.log("saveRecordType");
        }
        this.recordService.saveRecordType(recordType).pipe(first()).subscribe(
            response => {
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Line Item Saved', life: 3000 });
        });

    }

    /**
     * This is called when the Customer dropdown is changed
     * 
     * @param event value of Customer id
     */
    customerChanged(event) {
        if (this.debug) {
            console.log("customerChanged:event:" + event.value);
        }
        this.customers.forEach(customer => {
            if (customer.id === event.value) {
                this.selectedCustomer = customer;
                if (this.selectedCustomer.description.length > 0) {
                    this.showDescription = true;
                } else {
                    this.showDescription = false;
                }
            }
        })
        this.getSalesTax();
    }

    /**
     * This is called after a customer is selected in the Customer dropdown
     */
    getSalesTax() {
        this.scraperService.getSalesTax(this.selectedCustomer).pipe(first()).subscribe(
            response => {
                if (this.selectedCustomer.id > 0 && this.selectedCustomer.id > 0) {
                    this.estimate.salesTax = response.data.salesTax;
                    this.estimate.salesTaxAmt = this.estimate.subtotalAmt * this.estimate.salesTax;
                    this.estimate.totalAmt = this.estimate.subtotalAmt + this.estimate.salesTaxAmt;
                    this.salesTax = this.estimate.salesTax;
                    this.estimateDetail.salesTax = this.estimate.salesTax;
                }
            }
        )
    }

    /**
     * Retrieve EstimateStatus objects from API
     * 
     */
    getEstimateStatuses() {
        if (this.debug) {
            console.log("getEstimateStatuses");
        }
        this.estimateService.getEtimateStatuses().pipe(first()).subscribe(
            response => {
                this.estimateStatuses = <EstimateStatus[]>response.data.estimateStatuses;
                this.sortStatuses();
            }
        )
    }
    
    /**
     * Sorts the categories based on the pos field
     */
        sortStatuses() {
            this.estimateStatuses.sort((a, b) => a.pos - b.pos);
        }
    
    /**
     * Called when EstimateType dropdown is changed
     * 
     * @param event 
     */
    estimateTypeChanged(event) {
        if (this.debug) {
            console.log("estimateTypeChanged");
        }
        //console.log("estimateTypeChanged:lineItems:" + this.lineCategories.length);
        // create a variable to store the existing estimate name to be applied to the new estimate
        let estimateName = this.estimate.estimateName;
        if (this.populateItems) {
            //this.clearSelectedRecords();
            this.recordService.getFullEstimateType(event.value).pipe(first()).subscribe(
                response => {
                    this.selectedEstimateType = <EstimateType>response.data.estimateType;
                    this.estimate = new Estimate();
                    // add previous estimate name to new estimate
                    this.estimate.estimateName = estimateName;
                    this.estimate.estimateType = this.selectedEstimateType;
                    this.estimate.estimateTypeId = event.value;
                    this.estimate.subtotalAmt = 0;
                    this.estimate.totalAmt = 0;
                    this.estimate.salesTaxAmt = 0;
                    this.estimate.salesTax = this.salesTax;
                    this.estimateDetail.salesTax = this.salesTax
                    this.estimateDetail.description = this.selectedEstimateType.description;
                    this.populateLineItems();
                }
            )
        }
    }

    /**
     * This is called when a user selects a different 
     * estimate type in the dropdown list
     */
    populateLineItems() {
        if (this.debug) {
            console.log("populateLineItems");
        }
        this.estimateDetail.lineCategories = [];

        this.selectedEstimateType.categories.forEach(category => {
            let lineCategory = this.getLineCategoryFromCategory(category);
            category.recordTypes.forEach(rt => {
                let lineItem = this.getLineItemFromRecordType(rt);
                lineCategory.lineItems.push(lineItem);
            })
            this.estimateDetail.lineCategories.push(lineCategory);
        })
        this.lineCategories = this.estimateDetail.lineCategories;

        //this.estimateDetail.lineCategories = this.estimateDetail.lineCategories;
        //this.estimateDetail.lineCategories.forEach(cat => {
            //console.log("populateLineItems:item:" + cat.description);
        //    cat.lineItems.forEach(item => {
                //console.log("item:" + item.description);
        //    })
        //})
    }

    /**
     * called when estimate status is changed.
     * 
     * @param event 
     */
    estimateStatusChanged(event) {
        if (this.debug) {
            console.log("estimateStatusChanged:event:" + event.value);
        }
        this.estimate.statusId = event.value;
    }

    /**
     * Called when an edit field is updated
     * 
     * @param event 
     */
    onEditComplete(event) {
        this.calculateTotals();
    }
    
    /**
     * 
     */
    calculateTotals() {
        if (this.debug) {
            console.log("calculateTotals");
        }
        this.estimateDetail.subtotalAmt = 0;
        this.estimateDetail.totalAmt = 0;
        this.estimateDetail.salesTax = this.estimate.salesTax;
        this.estimateDetail.lineCategories.forEach(cat => {
            cat.lineItems.forEach(lineItem => {
                if (lineItem.quantity != undefined && lineItem.quantity > 0) {
                    lineItem.total = lineItem.quantity * lineItem.rate;
    
                    if (lineItem.total > 0) {
                        this.estimateDetail.subtotalAmt += lineItem.total;
                        this.estimateDetail.salesTaxAmt = this.estimateDetail.subtotalAmt * this.estimateDetail.salesTax;
                        this.estimateDetail.totalAmt = this.estimateDetail.subtotalAmt + this.estimateDetail.salesTaxAmt;
                    }
                }
            })
        })
        if (this.estimateDetail.version === this.estimate.currentVersion) {
            this.estimate.subtotalAmt = this.estimateDetail.subtotalAmt;
            this.estimate.salesTaxAmt = this.estimateDetail.salesTaxAmt;
            this.estimate.salesTax = this.estimateDetail.salesTax;
            this.estimate.totalAmt = this.estimateDetail.totalAmt;
        }
        this.calculateCatgegoryTotals();
    }

    calculateCatgegoryTotals() {
        if (this.debug) {
            console.log("calculateCategoryTotals");
        }
        this.estimateDetail.lineCategories.forEach(cat => {
            cat.total = 0;
            cat.lineItems.forEach(lineItem => {
                cat.total += lineItem.total;
            })
            //console.log("cat:" + cat.name + " - total:" + cat.total);
        })
    }

    /**
     * Category methods
     */

    
    /**
     * Populate the addCategoryDialog form and
     * show it to the user. 
     */
    addCategory() {

        /**
         * if categories already exist for this LineCategory
         * then select them
         */
        if (this.estimateDetail.lineCategories) {
            this.estimateDetail.lineCategories.forEach(linCat => {
                this.categories.forEach(cat => {
                    //console.log("addCategory:lineCat:" + linCat.categoryId + " cat:" + cat.id);
                    if (linCat.categoryId === cat.id) {
                        //console.log("addCategory:lineCat:" + linCat.categoryId + " cat:" + cat.id);
                        cat.selected = true;
                    }
                })
            })
        }

        this.addCategoryDialog = true;

    }

    /**
     * Add or remove LineCategories based on the user's selections
     */
    validateCategoryForm() {
        //console.log("validateCategoryForm::lineCategories:" + this.lineCategories.length);

        this.lineCategories = this.estimateDetail.lineCategories;
        //console.log("validateCategoryForm:linecategories:" + this.lineCategories.length);
        if (this.lineCategories.length > 0) {
            /**
             * used to determine if a LineCategory is already selected
             * so the default number of LineItems doesn't override the
             * existing number of LineItems for each LineCategory
            */
            let matchFound: boolean = false;

            // this is used to maintain existing LineCategories / LineItems 
            this.categories.forEach(category => {
                matchFound = false;
                this.lineCategories.forEach(linCat => {
                    if (category.id === linCat.categoryId) {
                        linCat.lineItems.forEach(lineItem => {
                            matchFound = true;
                        })
                    }
                });
                // add a new selected LineCategory
                if (!matchFound && category.selected) {
                    let lineCategory = this.getLineCategoryFromCategory(category);
                    category.recordTypes.forEach(rt => {
                        let lineItem = this.getLineItemFromRecordType(rt);
                        lineCategory.lineItems.push(lineItem);
                    })
                    this.lineCategories.push(lineCategory);
                } else {
                    // remove an existing (unchecked) LineCategory
                    this.lineCategories.forEach(linCat => {
                        if (linCat.categoryId === category.id && !category.selected) {
                            var index = this.lineCategories.indexOf(linCat);
                            this.lineCategories.splice(index, 1);
                        }
                    })
                }
            })
        } else {
            /**
             * if there are no existing LineCategories, create new ones 
             * based on the default LineItems
             */
            this.categories.forEach( category => {
                if (category.selected) {
                    let lineCategory = this.getLineCategoryFromCategory(category);
                    //console.log("category:" + category.name);
                    category.recordTypes.forEach(rt => {
                        let lineItem = this.getLineItemFromRecordType(rt);
                        lineCategory.lineItems.push(lineItem);
                    })
                    this.lineCategories.push(lineCategory);
                }
            });
            this.estimateDetail.lineCategories = this.lineCategories;
            if (this.estimateDetail.lineCategories.length > 0) {
                this.populateItems = false;
            } else {
                this.populateItems = true;
            }
        }

        this.estimateDetail.lineCategories = this.lineCategories;
        this.addCategoryDialog = false;
    }

    /**
     * add blank category
     */
    addNewCategory() {
        this.newCategory.description = "";
        this.newCategory.name = "";
        this.addNewCategoryDialog = true;
    }

    /**
     * 
     */
    validateNewCategoryForm() {
        this.submitted = true;

        if (this.newCategory.name && 
                this.newCategory.description) {
            
            this.populateItems = false;
            this.lineCategories = this.estimateDetail.lineCategories;

            // save the new category to the database
            this.recordService.saveCategory(this.newCategory).pipe(first()).subscribe(
                response => {
                    let category: Category = response.data.category;
                    //console.log("added category:" + category.name + " id:" + category.id);
                    //this.estimateDetail.lineCategories.push(this.getLineCategoryFromCategory(category));
                    this.lineCategories.push(this.getLineCategoryFromCategory(category));
                    this.estimateDetail.lineCategories = this.lineCategories;
                    //this.estimateDetail.lineCategories = this.lineCategories;

                    // get categories
                    this.recordService.getCategories().pipe(first()).subscribe(
                        response => {
                            this.categories = <Category[]>response.data.categories;
                            this.categories.forEach(cat => {
                                //console.log("validateNewCategoryForm:category:" + cat.name + " id:" + cat.id);
                            })
                        }
                    );
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Category Saved', life: 3000 });
            });
/*
            let lineItem = new LineItem;
            lineItem.type = "category";
            lineItem.description = this.newCategory.description;
            lineItem.name = this.newCategory.name;
            lineItem.rate = 0;
*/
//            this.lineItems.push(lineItem);
            this.hideAddNewCategoryDialog();
            this.submitted = false;
        }

    }

    /**
     * 
     */
    hideAddNewCategoryDialog() {
        this.addNewCategoryDialog = false;
    }


    /**
     * hides the addCategoryDialog
     */
    hideCategoryDialog() {
        this.addCategoryDialog = false;
    }
    
    /**
     * called when the user clicks on the Add Line Item button
     * 
     * A dialog with a list of available RecordTypes will be displayed.
     * The user will see the currently selected RecordTypes and can
     * add or remove RecordTypes by clicking on the associated 
     * checkboxes.
     */
    addLineItem(id) {
        this.clearSelectedRecordTypes();

        this.estimateDetail.lineCategories.forEach(linCat => {
            //console.log("addLineItem:lineCat:" + linCat.categoryId + " id:" + id);
            if (linCat.categoryId === id) {
                this.selectedCategoryId = id;
                linCat.lineItems.forEach(lineItem => {
                    this.recordTypes.forEach(rt => {
                        if (lineItem.recordTypeId === rt.id) {
                            rt.selected = true;
                        }
                    })
                })
            }
        })

        this.addLineItemDialog = true;
    }

    /**
     * 
     */
    validateLineItemForm() {
        let matchFound: boolean = false;
        
        this.estimateDetail.lineCategories.forEach(linCat => {
            if (linCat.categoryId === this.selectedCategoryId) {
                // loop through the recordTypes to find the selected lineItems
                this.recordTypes.forEach(rt => {
                    if (rt.selected) {
                        linCat.lineItems.forEach(lineItem => {
                            if (rt.id === lineItem.recordTypeId) {
                                //if lineItem exists
                                matchFound = true;
                            }
                        })
                        //ignore existing lineItems, add new lineItems
                        if (!matchFound) {
                            linCat.lineItems.push(this.getLineItemFromRecordType(rt));
                        }
                        // reset boolean
                        matchFound = false;
                        //remove selected items that were unselected by user
                    } else if (!rt.selected) {
                        linCat.lineItems.forEach(lineItem => {
                            if (rt.id === lineItem.recordTypeId) {
                                var index = linCat.lineItems.indexOf(lineItem);
                                linCat.lineItems.splice(index, 1);
                            }
                        })
                    }

                })
            }
        })
        // calculate the totals to include new items and exclude removed itesm
        this.calculateTotals();
        // hide dialog
        this.hideLineItemDialog();

    }

    /**
     * Hides the addRecordTypeDialog
     */
    hideLineItemDialog() {
        this.addLineItemDialog = false;
    }

    /**
     * called when the user clicks on the Add Line Item button
     * 
     * A dialog with a list of available RecordTypes will be displayed.
     * The user will be able to add or remove RecordTypes 
     * by clicking on the associated checkboxes.
     */
    addNewLineItem(id) {
        this.newRecordType.cost = null;
        this.newRecordType.costTypeId = -1;
        this.newRecordType.description = "";
        this.newRecordType.name = "";

        this.categories.forEach(cat => {
            if (cat.id === id) {
                this.selectedCategoryId = cat.id;
            }
        })
        
        this.addNewLineItemDialog = true;
    }

    /**
     * Called when user clicks the save button on the 
     * addRecordTypeDialog save button
     */
    validateNewLineItemForm() {
        //console.log("validateNewLineItemForm");
        this.submitted = true;
        let validated = false;
        if (this.newRecordType.name &&
            this.newRecordType.description &&
            this.newRecordType.cost > 0 &&
            this.newRecordType.costTypeId > 0) {

                // save recordType
                this.recordService.saveRecordType(this.newRecordType).pipe(first()).subscribe(
                    response => {
                        let rt = response.data.recordType;
                        //console.log("saved rt:" + rt.id);


                
                    this.categories.forEach(cat => {
                        if (cat.id === this.selectedCategoryId) {
                            cat.recordTypes.push(rt);
                            //cat.recordTypes.push(this.newRecordType);

                            //save category
                            //console.log("validateNewLineItemForm::selected category:" + cat.description);
                            //console.log("validateNewLineItemForm::newRecordType:" + cat.recordTypes.length);
                            this.recordService.updateCategory(cat).pipe(first()).subscribe(
                                response => {
                                    this.lineCategories.forEach(linCat => {
                                        //console.log("linCat:" + linCat.name);
                                    })
                                    //let cats = response.data.category.recordTypes;
                                    //cats.forEach(recType => {
                                    //    console.log("cat:" + cat.id + "saved rt:" + recType.id + ":" + recType.description);
                                    //})
                                    
                                    //get the updated recordTypes from the database so we can populate the selected list of items

                                    this.recordService.getRecordTypes().pipe(first()).subscribe(
                                        response => {
                                            this.recordTypes = response.data.recordTypes;

                                            this.lineCategories.forEach(linCat => {
                                                if (linCat.categoryId === this.selectedCategoryId) {
                                                    linCat.lineItems.push(this.getLineItemFromRecordType(rt));
                                                }
                                            })

                                            //console.log("recordTypes: " + this.recordTypes.length);
                                            //console.log("estimateDetails.lineCategories:" + this.estimateDetail.lineCategories.length); 
                                            // loop through the list of recordTypes to find the newly added one
                                            /*
                                            this.recordTypes.forEach(rt => {
                                                // found newly added recordType
                                                //console.log("rt name:" + rt.name + ":id" + rt.id);
                                                if (rt.name === this.newRecordType.name && rt.description === this.newRecordType.description) {
                                                    //this.newRecordType = rt;
                                                    // add the new lineItem to the estimate based on new recordType
                                                    //if (this.estimateDetail.lineCategories.length > 0) {
                                                    if (this.lineCategories.length > 0) {
                                                        this.categories.forEach(cat => {
                                                            this.lineCategories.forEach(linCat => {
                                                            //this.estimateDetail.lineCategories.forEach(linCat => {
                                                                console.log("lineItem to linCat name:" + linCat.name + " id:" + linCat.categoryId + 
                                                                    " cat name:" + cat.name + " id:" + cat.id);
                                                                //console.log("adding lineItem to cat " + linCat.description);
                                                                if (linCat.categoryId === this.selectedCategoryId) {
                                                                    console.log("adding lineItem to cat " + linCat.categoryId + ":" + this.selectedCategoryId);
                                                                    linCat.lineItems.push(this.getLineItemFromRecordType(rt));
                                                                }
                                                            });
                                        
                                                        });
                                                        //this.estimateDetail.lineCategories = this.lineCategories;
                                                        this.lineCategories = this.estimateDetail.lineCategories;
                                                    }
                                                }
                                            }) */
                                        }
                                    );
                            });
                        
                
                        }
                    });

                //
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Line Item Added', life: 3000 });
            })

            validated = true;
            this.submitted = false;
        }

        if (validated) {
            this.hideAddNewLineItemDialog();
        }
    }

    /**
     * 
     */
    hideAddNewLineItemDialog() {
        this.addNewLineItemDialog = false;
    }

    /**
     * This creates a LineCategory from a Category record.
     * 
     * @param category 
     * @returns 
     */
    getLineCategoryFromCategory(category: Category): LineCategory {

        let lineCategory = new LineCategory;
        lineCategory.description = category.description;
        lineCategory.name = category.name;
        lineCategory.categoryId = category.id;
        lineCategory.lineItems = [];

        return lineCategory;
    }

    /**
     * This creates a LineItem from a RecordType
     * 
     * @param recordType 
     * @returns 
     */
    getLineItemFromRecordType(recordType: RecordType): LineItem {
        let lineItem = new LineItem;
        lineItem.name = recordType.name;
        lineItem.description = recordType.description;
        lineItem.recordTypeId = recordType.id;
//        lineItem.type = "recordType";
        lineItem.costTypeId = recordType.costTypeId;
        lineItem.rate = recordType.cost;
        lineItem.rateDesc = recordType.description;
        lineItem.rateName = recordType.name;
        lineItem.rateDesc = this.getCostTypeDescription(recordType.costTypeId); 
        lineItem.rateName = this.getCostTypeName(recordType.costTypeId);
        return lineItem;
    }

    /**
     * Get CostType opbjects use in the line items
     */
    getCostTypes() {
        if (this.debug) {
            console.log("getCostTypes");
        }
        this.recordService.getCostTypes().pipe(first()).subscribe(
            response => {
                this.costTypes = <CostType[]>response.data.costTypes;
            }
        )
    }
    
    /**
     * Get the CostType description
     * @param id number representing the CostType
     * @returns string representing the cost type description
     */
    getCostTypeDescription(id: number) {
        let ct = new CostType();
        this.costTypes.forEach(costType => {
            if (costType.id === id) {
                ct = costType;
            }
        })
        return ct.description;
    }

    /**
     * Get the CostType name
     * @param id number representing the CostType
     * @returns string representing the CostType name
     */
    getCostTypeName(id: number) {
        let ct = new CostType();
        this.costTypes.forEach(costType => {
            if (costType.id === id) {
                ct = costType;
            }
        })
        return ct.name;
    }

    /**
     * unselect all categories and recordTypes.
     * used to ensure we don't show duplicates.
     */
    clearSelectedCategories() {
        this.categories.forEach(cat => {
            cat.selected = false;
        })
    }

    /**
     * unselect all categories and recordTypes.
     * used to ensure we don't show duplicates.
     */
    clearSelectedRecordTypes() {
        this.recordTypes.forEach(rt => {
            rt.selected = false;
        })
    }

//    createEstimate(estimate, ) {
//        this.router.navigate(['generate-estimate/' + estimate.id]);
//    }


    /**
     * 
     * @param estimate 
     * @param version 
     */
    createEstimate(estimate: Estimate, version: number) {
        this.router.navigate(
            ['generate-estimate'],
            { 
                queryParams: 
                    {   estimateId: estimate.id, 
                        version: version
                    }
            } 
        );
    }

    estimateVersionChanged(event) {
        if (this.debug) {
            console.log("estimateVersionChanged");
        }
        //console.log("estimate version changed:" + event.value);
        if (this.estimate != undefined && this.estimate.estimateDetails != undefined) {
            this.estimate.estimateDetails.forEach(estimateDetail => {
                if (estimateDetail.version === event.value) {
                    this.estimateDetail = estimateDetail;
                    
                    if (this.estimate.currentVersion === estimateDetail.version) {
                        this.isCurrentVersion = true;
                    } else {
                        this.isCurrentVersion = false;
                    }
                    
                    //console.log("estimateVersionChanged:notes:" + this.estimateDetail.description);
                    this.calculateTotals();
                }
            })
    
        }

    }

    addNewVersion() {
        if (this.debug) {
            console.log("addNewVersion");
        }

        //console.log("current estimate version " + this.estimate.currentVersion);
        this.estimateService.addNewVersion(this.estimate).pipe(first()).subscribe(
            response => {
                this.estimate = response.data.estimate;
                //console.log("added new estimate " + this.estimate.currentVersion);
                
                this.getEstimate(this.selectedEstimateId);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'New Version Added', life: 3000 });

            }
        )

        
    }

    getCompany() {
        let companies: Company[] = []; 
        this.companyService.getCompanies().pipe(first()).subscribe(
            response => {
                companies = response.data.companies;
                this.company = companies[0];
            }
        )
    }

    addAdminCategory() {
        let adminCategory = new LineCategory;
        let lineItems: LineItem[] = [];
        adminCategory.lineItems = lineItems; 
        let lineItem = new LineItem;
        lineItem.description = this.estimate.adminMessage;
        lineItem.quantity = 1;
        lineItem.name = "Admin Message";
        
        adminCategory.description = "Project Administration";
        adminCategory.name = "Admin";
        adminCategory.lineItems.push(lineItem);

        //console.log("adding category " + adminCategory.name);
        this.lineCategories.push(adminCategory);
    }


    
    

}
