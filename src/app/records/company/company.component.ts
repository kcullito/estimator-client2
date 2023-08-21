import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first } from 'rxjs';
import { Company } from 'src/app/_models/company.model';
import { CompanyService } from 'src/app/_services/company.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent {
    company: Company = new Company();
    companyDialog: boolean;
    companies: Company[] = [];

    submitted: boolean;
    statuses: any[];

    invalidEmail1: boolean = false;
    invalidEmail2: boolean = false;

    constructor(
        private companyService: CompanyService,
        private messageService: MessageService, 
        private confirmationService: ConfirmationService

    ) { }

    ngOnInit(): void {
        this.getCompanies();
    }

    getCompanies() {
        this.companyService.getCompanies().pipe(first()).subscribe(
            response => {
                this.companies = <Company[]>response.data.companies;
                this.companies.forEach(company => {
                    if (company) {
                        this.company = company;
                    }
                })
            }
        )
    }

    saveCompany() {
        //console.log("saveCompany:adminMessage:" + this.company.adminMessage);

        // if company exists, update it
        if (this.company.id > 0) {
            this.companyService.updateCompany(this.company).pipe(first()).subscribe(
                response => {
                    this.getCompanies();
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Company Updated', life: 3000 });
                }
            )
        
        } else {
            this.companyService.saveCompany(this.company).pipe(first()).subscribe(
                response => {
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Company Saved', life: 3000 });
                }
            )
        }
    }

    deleteCompany(company: Company) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + company.companyName + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.companyService.deleteCompany(company.id).pipe(first()).subscribe(
                    response => {
                    }
                )
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Company Deleted', life: 3000});
            }
        });
    }

    /**
     * Validate the form
     * 
     * calls saveCustomer if form is valid
     */
    validateForm() {
        this.submitted = true;
        if (
            this.company.companyName &&
            //this.company.disclaimer &&
            this.company.address &&
            this.company.city &&
            this.company.state &&
            this.company.zipCode &&
            this.company.phone1
            ) 
        {
            this.invalidEmail1 = false;
//            this.invalidEmail2 = false;
            if (this.company.email1) {
                if (this.validateEmail(this.company.email1)) {
                    this.invalidEmail1 = false;
                } else {
                    this.invalidEmail1 = true;
                    return;
                }
            }
/*            if (this.company.email2) {
                if (this.validateEmail(this.company.email2)) {
                    this.invalidEmail2 = false;
                } else {
                    this.invalidEmail2 = true;
                    return;
                }
            }*/

            if (!this.invalidEmail1) { //&& !this.invalidEmail2) {
                this.saveCompany();
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


}
