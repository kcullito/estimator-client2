import { Component, ViewChild } from '@angular/core';
import { Customer } from '../_models/customer.model';
import { Estimate } from '../_models/estimate.model';
import { EstimateType } from '../_models/estimate-type.model';
import { EstimateStatus } from '../_models/estimate-status.model';
import { environment } from 'src/environments/environment';
import { Table } from 'primeng/table';
import { CustomerService } from '../_services/customer.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import { EstimateService } from '../_services/estimate.service';
import { Router } from '@angular/router';
import { first } from 'rxjs';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent {
    selectedCustomer:           Customer = new Customer();

    customerDialog:             boolean;
    viewCustomerDialog:         boolean;

    customer:                   Customer = new Customer();
    customers:                  Customer[] = [];
    selectedCustomers:          Customer[] = [];
    estimates:                  Estimate[] = [];
    submitted:                  boolean;
    statuses:                   any[];
    estimateTypes:              EstimateType[] = [];
    estimateStatuses:           EstimateStatus[] = [];

    invalidEmail1:              boolean = false;
    invalidEmail2:              boolean = false;
    baseLink: string = `${environment.apiUrl}/api/customer/`;

    @ViewChild('dt') dt: Table | undefined;

    constructor(
        private customerService:        CustomerService,
        private messageService:         MessageService, 
        private confirmationService:    ConfirmationService,
        private estimateService:        EstimateService,
       //private recordService:          RecordServiceService,
        private router:                 Router,

    ) { }

    ngOnInit(): void {
        this.getCustomers();
        //this.getEstimateTypes();
        //this.getEstimateStatuses();
    }

    applyFilterGlobal($event, stringVal) {
        this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }

    getCustomers() {
        this.customerService.getCustomers().subscribe(
            (response) => {
                this.customers = response.data.customers;
                this.customers.forEach(cust => {
                    this.getCustomerFiles(cust);
                })
            }
        )
    }

    saveCustomer() {
        if (this.customer.id > 0) {
            this.customerService.updateCustomer(this.customer).pipe(first()).subscribe(
                response => {
                    this.getCustomers();
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Updated Customer Information', life: 3000 });
                }
            )
        } else {
            this.customerService.saveCustomer(this.customer).pipe(first()).subscribe(
                response => {
                    this.getCustomers();
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Saved Customer', life: 3000 });
                }
            )

        }
        this.hideDialog();
        this.customer = new Customer;
    }

        /**
     * Get a list of customer files from the server
     */
    getCustomerFiles(customer: Customer) {
        //let fileDetails: FileDetail[] = [];
        this.customerService.getCustomerFiles(customer.id).pipe(first()).subscribe(
            response => {
                customer.fileDetails = response.data.fileDetails;
                if (customer.fileDetails.length > 0) {
                    customer.fileDetails.sort((a,b) => a.version - b.version);
                }
            }
        )
    }
    


    openNew() {
        this.customer = new Customer();
        this.submitted = false;
        this.customerDialog = true;
    }

    editCustomer(customer: Customer) {
        this.customer = {...customer};
        this.customerDialog = true;
    }

    viewCustomer(customer: Customer) {
        this.customer = {...customer};
        this.viewCustomerDialog = true;
    }

    deleteCustomer(customer: Customer) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + customer.firstName + ' ' + customer.lastName + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.customerService.deleteCustomer(customer.id).pipe(first()).subscribe(
                    response => {
                        this.getCustomers();
                        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Customer Deleted', life: 3000});
                    }
                )
                
            }
        })

    }

    updateDisplayName(event) {
        //console.log("updateDisplayName:event:" + event);
        let displayName = "";
        if (this.customer.firstName && this.customer.lastName) {
            displayName = this.customer.firstName + " " + this.customer.lastName;
        }
        if (this.customer.firstName && 
                this.customer.firstName2 && 
                (this.customer.lastName === this.customer.lastName2)) {
                
                    displayName = this.customer.firstName + " & " + 
                        this.customer.firstName2 + " " + 
                        this.customer.lastName;
        }
        if (this.customer.firstName && 
                this.customer.firstName2 && 
                this.customer.lastName && 
                this.customer.lastName2 && 
                (this.customer.lastName != this.customer.lastName2)) {
            
                    displayName = this.customer.firstName + " " + 
                        this.customer.lastName + " & " + 
                        this.customer.firstName2 + " " + 
                        this.customer.lastName2;
            //console.log("updateDisplayName:displayName1:" + displayName);
        }
        this.customer.displayName = displayName;
    }

    hideDialog() {
        this.customerDialog = false;
        this.submitted = false;
    }

    hideViewDialog() {
        this.viewCustomerDialog = false;

    }

    /**
     * Validate the form
     * 
     * calls saveCustomer if form is valid
     */
    validateForm() {
        this.submitted = true;
        if (
            this.customer.firstName &&
            this.customer.lastName &&
            this.customer.address &&
            this.customer.city &&
            this.customer.state &&
            this.customer.zipCode
            ) 
        {
            this.invalidEmail1 = false;
            this.invalidEmail2 = false;
            if (this.customer.email1) {
                if (this.validateEmail(this.customer.email1)) {
                    this.invalidEmail1 = false;
                } else {
                    this.invalidEmail1 = true;
                    return;
                }
            }
            if (this.customer.email2) {
                if (this.validateEmail(this.customer.email2)) {
                    this.invalidEmail2 = false;
                } else {
                    this.invalidEmail2 = true;
                    return;
                }
            }

            if (!this.invalidEmail1 && !this.invalidEmail2) {
                this.saveCustomer();
            }
        }
    }

        /**
     * Validate the user entered a valid email address
     * 
     * @param email string representing the email address
     * @returns boolean representing success/failure of validation
     */
    validateEmail(email: string) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true;
        } else {
            return false;
        }
    }
    
        /**
     * 
     * @param customer 
     * @param filename 
     * @param download 
     */
        downloadPdf(customer: Customer, filename: string, download: boolean) {
            let url = `${this.baseLink}files/${customer.id}/${filename}/${download}`;
            window.open(url);
        }
    
        /**
         * 
         * @param customer 
         * @param filename 
         */
        deletePdf(customer: Customer, filename: string) {
            //let url = `${this.baseLink}files/${customer.id}`;
            this.confirmationService.confirm({
                message: 'Are you sure you want to delete <br/>' + filename + '?',
                header: 'Confirm',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.customerService.deleteFile(customer.id, filename).pipe(first()).subscribe(
                        response => {
                            //console.log("deletePdf:message:" + response.data.success);
                            //this.getCustomerFiles(customer);
                            this.getCustomers();
                            //this.router.navigate([this.router.url]);
    
                        }
                    )
                }
            });
        }
    
    
    

        
}
