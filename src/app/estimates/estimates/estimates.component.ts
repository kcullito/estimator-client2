import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { first } from 'rxjs';
import { Customer } from 'src/app/_models/customer.model';
import { EstimateDetail } from 'src/app/_models/estimate-detail.model';
import { EstimateStatus } from 'src/app/_models/estimate-status.model';
import { EstimateType } from 'src/app/_models/estimate-type.model';
import { Estimate } from 'src/app/_models/estimate.model';
import { User } from 'src/app/_models/user.model';
import { CustomerService } from 'src/app/_services/customer.service';
import { EstimateService } from 'src/app/_services/estimate.service';
import { RecordService } from 'src/app/_services/record.service';
import { StorageService } from 'src/app/_services/storage.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-estimates',
  templateUrl: './estimates.component.html',
  styleUrls: ['./estimates.component.scss']
})
export class EstimatesComponent {
    estimates:                  Estimate[] = [];
    selectedEstimate:           Estimate = new Estimate();
    selectedEstimates:          Estimate[] = [];

    estimateStatuses:           EstimateStatus[] = [];
    selectedEstimateStatus:     EstimateStatus = new EstimateStatus();

    customers:                  Customer[] = [];
    estimateTypes:              EstimateType[] = [];

    users:                      User[] = [];
    selectedUser:               User = new User();
    selectedUsers:              User[] = [];
    currentUser:                User = new User();
    showAllEstimates:           boolean = false;

    shownotesDialog:            boolean = false;
    notesVersion:               number = 0;
    notesText:                  string = "";

    showVersions:               boolean = false;

    @ViewChild('dt') dt: Table | undefined;

    constructor(
        private router:                 Router,
        private estimateService:        EstimateService,
        private messageService:         MessageService, 
        private confirmationService:    ConfirmationService,
        private customerService:        CustomerService,
        private recordService:          RecordService,
        private userService:            UserService,
        //private filterService: FilterService,
        private storage:                StorageService,
        private route:                  ActivatedRoute

    ) { }

    ngOnInit(): void {
        this.currentUser = this.storage.getUser();
        this.getEstimateTypes();
        this.getCustomers();
        this.getUsers();
    }

    /**
     * 
     */
    applyFilterGlobal($event, stringVal) {
        this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }
    

    /**
     * 
     */
    getEstimates() {
        this.estimateService.getEstimates().pipe(first()).subscribe(
            response => {
                this.estimates = <Estimate[]>response.data.estimates;
                this.selectedEstimates = this.estimates;
                //console.log("getEstimates:currentUser:" + this.currentUser.lastname);
                this.estimates.forEach(est => {
                    let tmpUser = this.getUserById(est.userId);
                    
                    est.estimator = tmpUser;
                    est.estimateTypeString = this.getEstimateTypeName(est.estimateTypeId);
                    est.customerName = this.getCustomerName(est.customerId);

                    //update estimate values based on current version values
                    this.getCurrentVersionValues(est);

                })

                // sort estimates by updated date
                this.sortEstimatesByUpdateDate();
            }
        )
    }

    /**
     * Sorts the categories based on the pos field
     */
    sortEstimatesByUpdateDate() {
        this.estimates.sort((a,b) => {
            return <any>new Date(b.updated) - <any>new Date(a.updated);
        })
    }

    /**
     * update the estimate values to match the current version values
     * 
     * @param estimate 
     */
    getCurrentVersionValues(estimate: Estimate) {
        estimate.estimateDetails.forEach(detail => {
            if (detail.version === estimate.currentVersion) {
                estimate.totalAmt = detail.totalAmt;
                estimate.salesTaxAmt = detail.salesTaxAmt;
                estimate.salesTax = detail.salesTax;
                estimate.subtotalAmt = detail.subtotalAmt;
                estimate.statusId = detail.statusId;
                estimate.statusName = this.getEstimateStatusName(detail.statusId);
                estimate.updated = detail.updated;
                //TODO: add estimator to detail object
                //estimate.estimator = detail.estimator
            }
        })
        
    }

    /**
     * 
     */
    getUsers() {
        this.userService.getUsers().pipe(first()).subscribe(
            response => {
                //response.data.users;

                response.data.users.forEach(usr => {
                    //console.log("getUsers::user:" + usr.firstname + " " + usr.lastname);
                    if (usr.firstname !== 'admin') {
                        this.users.push(usr);
                        //console.log("added user to list");
                    }
                })
            }
        )
    }

    /**
     * 
     */
    openNew() {
        this.router.navigate(['edit-estimate']);
    }

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

    /**
     * 
     * @param estimate 
     */
    editEstimate(estimate: Estimate) {
        if (estimate && estimate.id > 0) {
            this.router.navigate(['edit-estimate/', estimate.id] );
        }
    }

    /**
     * 
     * @param statusId 
     * @returns 
     */
    getEstimateStatusName(statusId: number): string {
        let statusName = "";
        if (statusId > 0) {
            this.estimateStatuses.forEach(status => {
                if (statusId === status.id) {
                    statusName = status.statusName;
                } 
            })
        } else {
            this.estimateStatuses.forEach(status => {
                if (status.statusName.includes("Created")) {
                    statusName = status.statusName;
                }
            })
        }
        return statusName;
    }

    /**
     * 
     */
    deleteEstimate(estimate: Estimate) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ALL versions of ' + estimate.estimateName + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.estimateService.deleteEstimate(estimate.id).pipe(first()).subscribe(
                    response => {
                        this.getEstimates();
                    }
                )
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Estimate Deleted', life: 3000});
            }
        })
    }

    deletedDetail() {

        console.log("deleting estimate detail");

        this.estimateService.deleteEstimateDetail(4).pipe(first()).subscribe(
            response => {
                console.log("deleteDetail:response:" + response.data.success);
            }
        )
    }

    /**
     * 
     * @param estimate 
     */
    deleteEstimateDetail(estimate: Estimate, estimateDetail: EstimateDetail) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete version ' + estimateDetail.version + ' of ' + estimate.estimateName + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                let index = 0;
                let selectedIndex = 0;
                let detailId = 0;
                estimate.estimateDetails.forEach(detail => {
                    
                    if (detail.id === estimateDetail.id) {
                        selectedIndex = index;
                        detailId = detail.id;
                    }
                    index++;
                })

                estimate.estimateDetails.splice(selectedIndex, 1);
                this.estimateService.deleteEstimateDetail(detailId).pipe(first()).subscribe(
                    response => {
                        console.log("delete estimate detail:" + response.data.success);
                    }
                );
                this.estimateService.saveEstimate(estimate).pipe(first()).subscribe(
                    response => {
                        let estimate = response.data.estimate;
                    }
                )

                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Estimate Version Deleted', life: 3000});
            }
        });
    } 

    /**
     * Retrieve CostType objects from API
     * 
     */
    getEstimateStatuses() {
        this.estimateService.getEtimateStatuses().pipe(first()).subscribe(
            response => {
                this.estimateStatuses = <EstimateStatus[]>response.data.estimateStatuses;
                this.estimateStatuses.forEach(status => {
                    if (status.statusName === "Created") {
                        this.selectedEstimateStatus = status;
                    }
                })
                this.getEstimates();

            }
        )
    }

    /**
     * 
     */
    getCustomers() {
        this.customerService.getCustomers().pipe(first()).subscribe(
            response => {
                this.customers = response.data.customers;
                this.getEstimateTypes();
            }
        )
    }

    /**
     * 
     */
    getEstimateTypes() {
        this.recordService.getEstimateTypes().pipe(first()).subscribe(
            response => {
                this.estimateTypes = response.data.estimateTypes;
                this.getEstimateStatuses();

            }
        )
    }

    
    /**
     * 
     * @param customerId 
     * @returns 
     */
    getCustomerName(customerId: number) {
        let selCust = new Customer;
        this.customers.forEach(customer => {
            if (customer.id === customerId) {
                selCust = customer;
            }
        })
        if (selCust.displayName !== null && selCust.displayName.length > 0) {
            return selCust.displayName;
        } else {
            return selCust.firstName + " " + selCust.lastName;
        }
    }

    /**
     * 
     * @param estimateTypeId 
     * @returns 
     */
    getEstimateTypeName(estimateTypeId: number) {
        let estType = new EstimateType;
        this.estimateTypes.forEach(estimateType => {
            if (estimateType.id === estimateTypeId) {
                estType = estimateType;
            }
        })
        if (estType !== undefined && estType.name ) {
            return estType.name;
        }
        return "";
    }

    /**
     * Currently not used
     * 
     * @param $event 
     *
    userChanged(event) {
        this.users.forEach(usr => {
            if (usr.id === event.value) {
                this.selectedUser = usr;
            }
        })
        this.filterEstimatesByUser();

        //console.log("userChanged::selectedUser:" + this.selectedUser.firstname + " " + this.selectedUser.lastname);
    }
*/

    /**
     * Currently not used
     * 
     * @param $event 
     */
    filterEstimatesByUser() {
        this.selectedUser = this.currentUser;
        this.selectedEstimates = [];
        if (this.selectedUser) {
            this.estimates.forEach(est => {
                if (est.userId === this.selectedUser.id) {
                    this.selectedEstimates.push(est);
                }
            })
        }

    }

    /**
     * Currently not used
     * 
     * @param $event 
     */
    resetUserSelection() {
        this.selectedUser = new User();
        this.selectedEstimates = this.estimates;
        
    }

    /**
     * Currently not used
     * 
     * @param $event 
     */
    getUserById(id: number): string {
        let estUser = new User();
        this.users.forEach(usr => {
            if (usr.id === id) {
                estUser = usr;
            }
        })
        if (estUser.firstname !== undefined) {
            return estUser.firstname + " " + estUser.lastname;
        } else {
            return "";
        }
    }


    /**
     * Filter the estimates based on the selected estimators
     * 
     * @param $event 
     */
    filterEstimates($event) {
        this.selectedEstimates = [];
        this.estimates.forEach(est => {
            this.selectedUsers.forEach(usr => {
                if (est.userId === usr.id) {
                    this.selectedEstimates.push(est);
                }
            })
        })
    }

    /**
     * 
     * @param estimate 
     */
    showNotes(estimate: Estimate) {
        estimate.estimateDetails.forEach(estimateDetail => {
            this.notesVersion = estimate.currentVersion;
            if (estimateDetail.version === estimate.currentVersion) {
                this.notesText = estimateDetail.notes;
            }
        })
        this.shownotesDialog = true;
    }

    /**
     * 
     * @param estimateDetail 
     */
    showDetailNotes(estimateDetail: EstimateDetail) {
        this.notesVersion = estimateDetail.version;
        this.notesText = estimateDetail.notes;
        this.shownotesDialog = true;
    }


}
