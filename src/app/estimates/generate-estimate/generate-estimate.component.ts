import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable, catchError, first, map, of, startWith } from 'rxjs';
import { DataState } from 'src/app/_enums/data-state.enum';
import { AppState } from 'src/app/_models/app-state.model';
import { Company } from 'src/app/_models/company.model';
import { CustomResponse } from 'src/app/_models/custom-response.model';
import { Customer } from 'src/app/_models/customer.model';
import { EstimateDetail } from 'src/app/_models/estimate-detail.model';
import { Estimate } from 'src/app/_models/estimate.model';
import { CompanyService } from 'src/app/_services/company.service';
import { CustomerService } from 'src/app/_services/customer.service';
import { EstimateService } from 'src/app/_services/estimate.service';
import { RecordService } from 'src/app/_services/record.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-generate-estimate',
  templateUrl: './generate-estimate.component.html',
  styleUrls: ['./generate-estimate.component.scss']
})
export class GenerateEstimateComponent {
    appState$:                  Observable<AppState<CustomResponse>>;
    private dataSubject = new   BehaviorSubject<CustomResponse>(new CustomResponse());
    readonly DataState =        DataState;
    
    estimate: Estimate = new    Estimate;
    estimateDetails:            EstimateDetail[] = [];
    estimateDetail:             EstimateDetail = new EstimateDetail;
    customer: Customer = new    Customer;
    company: Company = new      Company;
    
    currentVersion:             number = 0;
    versions:                   number[] = [];
    fileName:                   string;
    currentVersions:            string[] = [];
    submitted:                  boolean = false;

    logos:                      string[] = [];
    logoDialog:                 boolean = false;
    selectedLogo:               string = "";
    
    banners:                    string[] = [];
    bannerDialog:               boolean = false;
    selectedBanner:             string = "";

    detailVersion:              number = 0;

    baseLink: string = `${environment.apiUrl}/api/customer/`;
    imageLink: string = `${environment.apiUrl}`;


    constructor(
        private estimateService:    EstimateService,
        private route:              ActivatedRoute,
        private router:             Router,
        private customerService:    CustomerService,
        private recordService:      RecordService,
        private messageService:     MessageService, 
        private companyService:     CompanyService

    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            let estimateId = params['estimateId'];
            let version = params['version']
            this.detailVersion = +version;
            this.getCompany();
            this.getEstimate(estimateId);
        })
    }


    /**
     * 
     * @param estimateId 
     * @param version 
     */
    getEstimate(estimateId: number) {
        //let version: number = +ver;

        this.estimateService.getEstimate(estimateId).pipe(first()).subscribe(
            response => {
                this.estimate = <Estimate>response.data.estimate;
                this.getEstimateType(this.estimate.estimateTypeId);
                this.getCurrentEstimateDetail();
                
/*                this.estimate.estimateDetails.forEach(estimateDetail => {
                    //console.log("getEstimate:detailVersion:" + estimateDetail.version + " version:" + this.detailVersion);
                    if (estimateDetail.version === this.detailVersion) {
                        //console.log("Match:detailVersion:" + estimateDetail.version + " version:" + this.detailVersion);
                        this.estimateDetail = estimateDetail;
                        if (this.estimateDetail.lineCategories && this.estimateDetail.lineCategories.length > 0) {
                            this.sortLineCategories();
                        }
                        this.populateVersionDropdown();
                    }
                })
*/
                this.getCustomer(this.estimate.customerId);
            }
        )
    }

    getCurrentEstimateDetail() {
      this.estimate.estimateDetails.forEach(estimateDetail => {
           //console.log("getEstimate:detailVersion:" + estimateDetail.version + " version:" + this.detailVersion);
            if (estimateDetail.version === this.detailVersion) {
                //console.log("Match:detailVersion:" + estimateDetail.version + " version:" + this.detailVersion);
                this.estimateDetail = estimateDetail;
                if (this.estimateDetail.adminMessage === null || this.estimateDetail.adminMessage.length < 1) {
                    this.estimateDetail.adminMessage = this.company.adminMessage;
                }
                if (this.estimateDetail.adminPercent < 1) {
                    this.estimateDetail.adminPercent = this.company.adminPercent;
                }
                //this.calculateAdminCost();
                if (this.estimateDetail.lineCategories && this.estimateDetail.lineCategories.length > 0) {
                    this.sortLineCategories();
                }
                this.populateVersionDropdown();
                //console.log("estimateAdminMessage:" + estimateDetail.adminMessage);
                //console.log("estimateAdminPercent:" + estimateDetail.adminPercent);
            }
        })
    }

    /**
     * 
     */
    saveEstimate() {
        if (this.estimate.id > 0) {
            this.estimateService.updateEstimate(this.estimate).pipe(first()).subscribe(
                response => {
                    this.estimate = <Estimate>response.data.estimate;
                    this.sortLineCategories();
                }
            )
        }
    }

    updateEstimate() {
        this.appState$ = this.estimateService.updateEstimate$(this.estimate)
        .pipe(
            map(response => {
                this.getEstimate;
                return { dataState: DataState.LOADED_STATE, appData: response }
            }),
            startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
            catchError((error: string) => {
                return of({ dataState: DataState.ERROR_STATE, error: "Error retrieving page." })
            })
        );
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Estimate Updated', life: 3000 });

    }

    updateEstimateDetail() {
        this.estimateService.updateEstimateDetail(this.estimateDetail).pipe(first()).subscribe(
            response => {
                let estimateDetail = response.data.estimateDetail;
                //console.log("saveEstimateDetail::Admin Percent:" + estimateDetail.adminPercent);
                //console.log("saveEstimateDetail::Admin Amount:" + estimateDetail.adminAmount);
                //console.log("saveEstimateDetail::Admin Message:" + estimateDetail.adminMessage);
            }
        )
    }
    

    /**
     * Retrieve the customer for this estimate
     * @param id 
     */
    getCustomer(id: number) {
        //console.log("generateEstimate::getCustomer:id:" + id);
        this.customerService.getCustomer(id).pipe(first()).subscribe(
            response => {
                this.customer = <Customer>response.data.customer;
                this.getCustomerFiles(this.customer);

            }
        );
    }

    getCompany() {
        this.companyService.getCompanies().pipe(first()).subscribe(
            response => {
                response.data.companies.forEach(
                    company => {
                        if (company.id) {
                            this.company = company;
                            //console.log("company:" + company.companyName);
                        }
                    }
                )
            }
        )
    }


    /**
     * User reordered the categories 
     * 
     * @param event 
     */
    rowChanged(event) {
        let index = 0;
        this.estimateDetail.lineCategories.forEach(lineCategory => {
            lineCategory.pos = index++;
        })
        this.updateEstimateDetail();
    }

    /**
     * Call the web service to generate the estimate document
     */
    generatePdf() {
        this.submitted = true;
        if (this.detailVersion > 0) {
            this.estimateService.generateEstimate(this.estimate.id, 1, this.detailVersion).pipe(first()).subscribe(
                response => {
                    //console.log("generateEstimate:response:");
                    this.getCustomerFiles(this.customer);
                    //let messageRef = this.openSnackBar("Estimate successfully saved","");
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Estimate Created', life: 3000});

            })
        }
    }

    generateExcel() {

    }

    calculateAdminCost() {
        let adminAmount: number = 0;
        if (this.estimateDetail.adminAmount > 0 && this.estimateDetail.subtotalAmt > 0) {
            let adminPercent = ((this.estimateDetail.adminAmount / this.estimateDetail.subtotalAmt) * 100);
            this.estimateDetail.adminPercent = Number(adminPercent.toFixed(2));
        }
    }

    updateAdminPercent(event) {
        let adminAmount = Number((this.estimateDetail.adminPercent/100) * this.estimateDetail.subtotalAmt).toFixed(2);
        let adminPercent = Number(this.estimateDetail.adminPercent).toFixed(2);
        this.estimateDetail.adminPercent = Number(adminPercent);
        this.estimateDetail.adminAmount = Number(adminAmount);
        this.updateEstimateDetail();
    }
    
    updateAdminAmount(event) {
        let adminPercent = Number((this.estimateDetail.adminAmount / this.estimateDetail.subtotalAmt) * 100).toFixed(2);
        let adminAmount = Number(this.estimateDetail.adminAmount).toFixed(2);
        this.estimateDetail.adminPercent = Number(adminPercent);
        this.estimateDetail.adminAmount = Number(adminAmount);
        this.updateEstimateDetail();
    }

    updateAdminText(event) {
        this.updateEstimateDetail();
    }

    /**
     * Automatically save estimate if the display name is changed
     */
    displayNameChanged() {
        this.saveCustomer();
    }

    /**
     * Save the customer record
     */
    saveCustomer() {
        this.customerService.updateCustomer(this.customer).pipe(first()).subscribe(
            response => {
                this.customer = <Customer>response.data.customer;
            }
        )
    }

    /**
     * Get a list of customer files from the server
     */
    getCustomerFiles(customer: Customer) {
        this.currentVersions = [];
        //let fileDetails: FileDetail[] = [];
        this.customerService.getCustomerFiles(customer.id).pipe(first()).subscribe(
            response => {
                customer.fileDetails = response.data.fileDetails;
                //this.estimateDetail.notes = "";
                if (customer.fileDetails.length > 0) {
                    customer.fileDetails.forEach(file => {
                        
                        //console.log("getCustomerFiles:file:" + file.fileName  + ":" + this.fileName);
                        if (file.fileName.includes(this.fileName)) {
                            //console.log("found matching file name");
                            this.currentVersions.push(file.fileName);

                        }
                        this.currentVersions.forEach(version => {
                            //console.log("version:" + version);
                        })
                        //this.estimateDetail.notes += file.fileName + "\n";
    
                    })
                    this.sortFileMames();
                    //this.populateVersionDropdown();
                //} else {
                    //this.versions.push(1);
                }
            }
        )
    }

    populateVersionDropdown() {
        this.versions = [];
        this.estimate.estimateDetails.forEach(detail => {
            //console.log("generate-estimate:popoulateVersionDropdown:version:" + detail.version);
            this.versions.push(detail.version);
        })
        /*
        let lastVersion = 0;
        this.customer.fileDetails.forEach( file =>{
            if (file.fileName.includes(this.fileName)) {
                let version = this.getVersionFromFilename(file.fileName);
                if (version > 0) {
                    this.versions.push(version);
                    if (version > lastVersion) {
                        lastVersion = version;
                    }
                }
            }
        })
        lastVersion += 1;
        this.versions.push(lastVersion);
        this.sortVersions();
        */

    }

    getVersionFromFilename(filename: string): number {
        var start = filename.indexOf("_V") + 2;
        var end = filename.indexOf(".pdf");
        var version = filename.substring(start,end);
//        console.log("version:" + version);
        return Number(version);
    }

    versionChanged(event) {
        //console.log("estimate version changed:" + event.value);
        this.estimate.currentVersion = event.value;
        this.estimate.estimateDetails.forEach(detail => {
            if (detail.version === event.value) {
                this.estimateDetail = detail;
                if (this.estimateDetail.adminMessage === null || this.estimateDetail.adminMessage.length < 1) {
                    this.estimateDetail.adminMessage = this.company.adminMessage;
                }
                if (this.estimateDetail.adminPercent < 1) {
                    this.estimateDetail.adminPercent = this.company.adminPercent;
                }
                //this.calculateAdminCost();
                if (this.estimateDetail.lineCategories && this.estimateDetail.lineCategories.length > 0) {
                    this.sortLineCategories();
                }
            }
        })
    }

    includeTitleChanged($event) {
        //console.log("includeTitleChanged-1:" + this.estimate.includeTitlePage);
        this.saveEstimate();
    }

    includeSummaryChanged(event) {
        //console.log("includeSummaryChanged:" + this.estimate.includeSummaryPage);
        this.saveEstimate();
    }

    getEstimateType(id: number) {
        this.recordService.getEstimateTypes().pipe(first()).subscribe(
            response => {
                let estimateTypes = response.data.estimateTypes;
                estimateTypes.forEach(estimateType => {
                    if (estimateType.id === id) {
                        this.fileName = this.estimate.estimateName + "_" + estimateType.name;
                    }
                })
            }
        )
    }

    /**
     * Sorts the categories based on the pos field
     */
    sortLineCategories() {
        this.estimateDetail.lineCategories.sort((a, b) => a.pos - b.pos);
    }

    sortFileMames() {
        this.currentVersions.sort((a,b) => a.localeCompare(b));
    }

    sortVersions() {
        this.versions.sort((a,b) => a - b);
    }

    /*
    openSnackBar(message: string, action: string) {
        let sb = this.snackBar.open(message, action, {
            duration: 5000,
            verticalPosition: "top"
        });
        sb.onAction().subscribe(()=> {
            // may want to clear the login fields
        });
    }
    */

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
     * @param estimate 
     */
    editEstimate(estimate: Estimate) {
        if (estimate && estimate.id > 0) {
            this.router.navigate(['edit-estimate/' + estimate.id]);
        }
    }

//    showImages() {
//        let imageLocation = "src/main/resources/static/images/Logos/";
//    }

    chooseLogo() {
        //console.log("Choose Logo");
        this.getLogos();
    }

    getLogos() {
        //console.log("Get Logos");
        this.logoDialog = true;
        this.customerService.getLogoFiles().pipe(first()).subscribe(
            response => {
                this.logos = response.data.logos;
                this.logos.forEach(logo => {
                    //console.log("generate-estimate::getLogos:logo:" + logo);

                })
            }
        )
    }
    
    chooseBanner() {
        //console.log("Choose Banner");
        this.getBanners();
    }

    getBanners() {
        //console.log("Get Banners from " + this.imageLink);
        this.bannerDialog = true;
        this.customerService.getBannerFiles().pipe(first()).subscribe(
            response => {
                this.banners = response.data.banners;
                //this.banners.forEach(banner => {
                //    console.log("Banner:" + banner);
                //})
            }
        )
    }

    hideLogoDialog() {
        this.logoDialog = false;
    }

    hideBannerDialog() {
        this.bannerDialog = false;
    }

    saveLogo(logo: string) {
        //console.log("saveLogos:" + logo);
        this.selectedLogo = logo;
        this.estimate.logo = logo;
        this.hideLogoDialog();
        this.saveEstimate();
    }

    saveBanner(banner: string) {
        //console.log("saveBanner:" + banner);
        this.selectedBanner = banner;
        this.estimate.banner = banner;
        this.hideBannerDialog();
        this.saveEstimate();
    }

    removeLogo() {
        this.estimate.logo = "";
        this.saveEstimate();
        this.hideLogoDialog()
    }

    removeBanner() {
        this.estimate.banner = "";
        this.saveEstimate();
        this.hideBannerDialog()
    }


}
