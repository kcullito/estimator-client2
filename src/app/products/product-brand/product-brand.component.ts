import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { first } from 'rxjs';
import { ProductBrand } from 'src/app/_models/products/product-brand.model';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-product-brand',
  templateUrl: './product-brand.component.html',
  styleUrls: ['./product-brand.component.scss']
})
export class ProductBrandComponent {

    productBrands: ProductBrand[] = [];
    productBrand: ProductBrand = new ProductBrand();
    productBrandDialog: boolean = false;

    submitted: boolean = false;

    @ViewChild('dt') dt: Table | undefined;


    constructor(
        private productService:         ProductService,
        private messageService:         MessageService, 
        private confirmationService:    ConfirmationService,

    ) {}

    ngOnInit(): void {
        this.getProductBrands();
    }

    applyFilterGlobal($event, stringVal) {
        this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }


    getProductBrands() {
        this.productService.getProductBrands().subscribe(
            (response) => {
                this.productBrands = response.data.brands;
            }
        )
    }

    openNewProductBrand() {
        this.productBrand = new ProductBrand();
        this.submitted = false;
        this.productBrandDialog = true;
    }

    saveProductBrand(productBrand: ProductBrand) {
        if (productBrand.id > 0) {
            // update survey
            this.productService.updateProductBrand(productBrand).pipe(first()).subscribe(
                response => {
                    this.getProductBrands();
                }
            )
        } else {
            // create new survey
            this.productService.saveProductBrand(productBrand).pipe(first()).subscribe(
                response => {
                    this.getProductBrands();
                }
            )
        }
    }


    editProductBrand(productBrand: ProductBrand) {
        this.productBrand = {...productBrand};
        this.productBrandDialog = true;
    }

    deleteProductBrand(productBrand: ProductBrand) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + productBrand.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.productService.deleteProductBrand(productBrand.id).pipe(first()).subscribe(
                    response => {
                        this.getProductBrands();
                        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Brand Deleted', life: 3000});
                    }
                )
                
            }
        })
    }

    hideProductBrandDialog() {
        this.productBrandDialog = false;
    }

    validateProductBrandForm() {
        if (this.productBrand.name && this.productBrand.description) {
            this.saveProductBrand(this.productBrand);
            this.productBrandDialog = false;
        }
    }




}
