import { Component } from '@angular/core';
import { Estimate } from '../_models/estimate.model';
import { User } from '../_models/user.model';
import { EstimateType } from '../_models/estimate-type.model';
import { Customer } from '../_models/customer.model';
import { EstimateStatus } from '../_models/estimate-status.model';
import { EstimateService } from '../_services/estimate.service';
import { StorageService } from '../_services/storage.service';
import { CustomerService } from '../_services/customer.service';
import { UserService } from '../_services/user.service';
import { RecordService } from '../_services/record.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    estimates:              Estimate[] = [];
    feedbackEstimates:      Estimate[] = [];
    attentionEstimates:     Estimate[] = [];

    users:                  User[] = [];
    estimateTypes:          EstimateType[] = [];
    customers:              Customer[] = [];
    estimateStatuses:       EstimateStatus[] = [];

    showConfigDialog:       boolean = false;
    showCustomerDialog:     boolean = false;
    showSurveyDialog:       boolean = false;

    selectedEstimateStatus: EstimateStatus;
    currentUser:            User;
    mailMessage:            string = "I am checking in with you to see if you had a chance to review the estimate I sent you. Let me know if you have any questions or if you would like to review the estimate in person or over the phone.%0D%0A %0D%0A Thanks,%0D%0A";

    sourceData: any;
    sourceOptions: any;

    scoreData: any;
    scoreOptions: any;

    basicData: any;
    basicOptions: any;

    barData: any;
    barOptions: any;

    // colors
    green: any = 'rgba(64, 255, 64, 0.2';
    greenLine: any = 'rgb(128, 255, 128)';

    red: any = 'rgba(255, 64, 64, 0.2)';
    redLine: any = 'rgb(255, 64, 64)';
    
    blue: any = 'rgba(54, 162, 235, 0.2)';
    blueLine: any = 'rgb(54, 162, 235)';
    
    purple: any = 'rgba(153, 102, 255, 0.2)';
    purpleLine: any = 'rgb(153, 102, 255)';

    orange: any = 'rgba(255, 159, 64, 0.2)';
    orangeLine: any = 'rgb(255, 159, 64)';

    yellow: any = 'rgba(255, 255, 64, 0.2)';
    yellowLine: any = 'rgb(128, 128, 32)';

    constructor(
        private estimateService: EstimateService,
        private storage: StorageService,
        private customerService: CustomerService,
        private recordService: RecordService,
        private userService: UserService,

    ) { }

    ngOnInit(): void {
        //console.log("In Home.ngOnInit");
        this.currentUser = this.storage.getUser();
        this.getCustomers();
        this.getUsers();
        //this.getAllEstimates();

        const documentStyle = getComputedStyle(document.documentElement);
        //const textColor = documentStyle.getPropertyValue('--text-color');
        //const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        //const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // bar chart
        this.basicData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Projects Completed per Month',
                    data: [10, 12, 9, 8, 11, 9],
                    backgroundColor: [this.green, this.green, this.green, this.green, this.green, this.green],
                    borderColor: [this.greenLine, this.greenLine, this.greenLine, this.greenLine, this.greenLine, this.greenLine],
                    borderWidth: 1
                }
            ]
        };

        this.basicOptions = {
            plugins: {
                legend: {
                    labels: {
                        //color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        //color: textColorSecondary
                    },
                    grid: {
                        //color: surfaceBorder,
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        //color: textColorSecondary
                    },
                    grid: {
                        //color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        // pie chart
        this.sourceData = {
            labels: ['Facebook', 'Website', 'Reference', 'Marketing'],
            datasets: [
                {
                    label: 'How did you hear about us',
                    data: [30, 20, 40, 10],
                    backgroundColor: [this.blue, this.green, this.purple, this.orange],
                    borderColor: [this.blueLine, this.greenLine, this.purpleLine, this.orangeLine],
                    borderWidth: 1
/*
                    data: [540, 325, 702],
                    backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')] */
                }
            ]
        };

        this.sourceOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        //color: textColor
                    }
                }
            }
        };    
    
        // pie chart
        this.scoreData = {
            labels: ['Extremely', 'Very', 'Satisfied', 'Somewhat', 'Not'],
            datasets: [
                {
                    label: 'Customer Satisfaction',
                    data: [75, 15, 10, 0, 0],
                    backgroundColor: [this.green, this.blue, this.yellow, this.orange, this.red], 
                    borderColor: [this.greenLine, this.blueLine, this.yellow, this.orangeLine, this.redLine],
                    borderWidth: 1
/*
                    data: [540, 325, 702],
                    backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')] */
                }
            ]
        };

        this.scoreOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        //color: textColor
                    }
                }
            }
        };    


        this.barData = {
            labels: ['Kitchen Remodel', 'Bathroom Remodel', 'New Construction', 'Home Repair', 'House Siding', 'Multi-Room Remodel', 'House Painting'],
            datasets: [
                {
                    label: 'Estimates Delivered',
                    data: [65, 59, 40, 10, 12, 5, 4],
                    backgroundColor: [this.blue],
                    borderColor: [this.blueLine],
                    borderWidth: 1
                },
                {
                    label: 'Estimates Accepted',
                    data: [55, 48, 20, 2, 6, 4, 1],
                    backgroundColor: [this.green],
                    borderColor: [this.greenLine],
                    borderWidth: 1
                }
            ]
        };

        this.barOptions = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        //color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        //color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        //color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        //color: textColorSecondary
                    },
                    grid: {
                        //color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    
    
    
    }

    

    

    getAllEstimates() {
        this.attentionEstimates = [];
        this.estimateService.getEstimates().pipe(first()).subscribe(
            response => {
                this.estimates = response.data.estimates;
                this.attentionEstimates = [];
                this.feedbackEstimates = [];

                this.estimates.forEach(est => {
                    //console.log("Home::getAllEstimates:estimate:" + est.estimateName);
                    if (this.getNeedsAttention(est.statusId)) {
                        //console.log("found one " + est.statusId);
                        est.estimator = this.getUserById(est.userId);
                        est.estimateTypeString = this.getEstimateTypeName(est.estimateTypeId);
                        est.customerName = this.getCustomerName(est.customerId);
                        est.statusName = this.getEstimateStatusName(est.statusId);
                        this.attentionEstimates.push(est);
                    } else if (this.getNeedsCall(est.statusId)) {
                        est.estimator = this.getUserById(est.userId);
                        est.estimateTypeString = this.getEstimateTypeName(est.estimateTypeId);
                        est.customerName = this.getCustomerName(est.customerId);
                        est.statusName = this.getEstimateStatusName(est.statusId);
                        this.feedbackEstimates.push(est);
                    }
                })
            }
        )
    }

    getNeedsAttention(statusId: number):boolean {
        let success: boolean = false;
        this.estimateStatuses.forEach(status => {
            if (status.statusName === 'Delivered') {
                if (status.id === statusId) {
                    success = true;
                }
            }
        })
        return success;
    }

    getNeedsCall(statusId: number):boolean {
        let success: boolean = false;
        this.estimateStatuses.forEach(status => {
            if (status.statusName === 'Completed' || status.statusName === 'Rejected') {
                if (status.id === statusId) {
                    success = true;
                }
            }
        })
        return success;
    }

    /**
     * Currently not used
     * 
     * @param $event 
     */
    getUserById(id: number): string {
        //console.log("getUserById:id:" + id);
        let estUser = new User();
        this.users.forEach(usr => {
            if (usr.id === id) {
                estUser = usr;
            }
        })
        //console.log("getUserById:user:" + estUser.firstname);
        return estUser.firstname + " " + estUser.lastname;
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
                //console.log("estimate type:" + estType.name);
                estType = estimateType;
            }
        })
        if (estType !== undefined && estType.name ) {
            //console.log("returning estimate type:" + estType.name);
            return estType.name;
        }
        //console.log("returning blank");
        return "";
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
            }
        })
        
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
                if (status.statusName.includes("Draft")) {
                    //statusId === status.id;
                    statusName = status.statusName;
                }
            })
        }
        //console.log("getEstimateStatusName:" + statusName);
        return statusName;
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
     * Retrieve CostType objects from API
     * 
     */
    getEstimateStatuses() {
        this.estimateService.getEtimateStatuses().pipe(first()).subscribe(
            response => {
                this.estimateStatuses = response.data.estimateStatuses;
                this.estimateStatuses.forEach(status => {
                    if (status.statusName === "Draft") {
                        this.selectedEstimateStatus = status;
                    }
                })
                this.getAllEstimates();

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
    getUsers() {
        this.userService.getUsers().pipe(first()).subscribe(
            response => {
                //response.data.users;
                //console.log("message:" + response.message);
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

    /*
    panelResize(event) {
        //console.log("panel resized:" + event.originalEvent);
        console.log("panel resized:" + event.sizes);
    }
*/

    getCustomer(customerId: number):Customer {
        let selectedCustomer: Customer = new Customer;
        this.customers.forEach(customer => {
            if (customer.id === customerId) {
                selectedCustomer = customer;
            }
        })
        return selectedCustomer;
    }

    getEstimator(estimateId: number):string {
        let estimator: string = "";
        this.attentionEstimates.forEach(estimate => {
            if (estimate.id === estimateId) {
                estimator = this.getUserById(estimate.userId);
            }
        })
        return estimator;
    }

    getCustomerPhone(customerId: number):string {
        let phone: string = "";

        this.customers.forEach(customer => {
            if (customer.id === customerId) {
                phone = customer.phone1;
            }
        })

        return phone;
    }

    getCustomerEmail(customerId: number):string {
        let email: string = "";
        this.customers.forEach(customer => {
            if (customer.id === customerId) {
                email = customer.email1;
            }
        })
        return email;
    }

    getMailMessage(customerId: number, estimateId: number):string {
        let message = this.mailMessage;
        let customer: Customer = this.getCustomer(customerId);
        let estimator: string = this.getEstimator(estimateId);
        let estimatorFirstName = estimator.substring(0, estimator.indexOf(' '));
        //console.log("getMailMessage:customer:" + customer.firstName + " - estimator:" + estimator);
        let mailMessage = customer.firstName+",%0D%0A%0D%0A" + message + "" + estimatorFirstName;


        return mailMessage;
    }

    showConfigurationDialog() {
        this.showConfigDialog = true;
    }

    hideConfigDialog() {
        this.showConfigDialog = false;
    }

    hideCustomerDialog() {
        this.showCustomerDialog = false;
    }

    viewCustomer(customerId: number) {
        this.showCustomerDialog = true;
    }

    hideSurveyDialog() {
        this.showSurveyDialog = false;
    }

    viewSurvey(customerId: number) {
        this.showSurveyDialog = true;
    }

    /**
     * Sorts the categories based on the pos field
     */
    sortEstimatesByUpdateDate() {
        this.estimates.sort((a,b) => {
            return <any>new Date(b.updated) - <any>new Date(a.updated);
        })
    }
    
    


}
