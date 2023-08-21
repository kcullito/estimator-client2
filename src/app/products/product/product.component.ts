import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { first } from 'rxjs';
import { ProductBrand } from 'src/app/_models/products/product-brand.model';
import { Product } from 'src/app/_models/products/product.model';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {

    products: Product[] = [];
    product: Product = new Product();
    productDialog: boolean = false;

    productBrands: ProductBrand[] = [];

    submitted: boolean = false;

    @ViewChild('dt') dt: Table | undefined;


    constructor(
        private productService:         ProductService,
        private messageService:         MessageService, 
        private confirmationService:    ConfirmationService,

    ) {}

    ngOnInit(): void {
        this.getProducts();
    }

    applyFilterGlobal($event, stringVal) {
        this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }

    getProducts() {
        this.productService.getProducts().subscribe(
            (response) => {
                this.products = response.data.products;
                this.getBrands();
            }
        )
    }

    getBrands() {
        this.productService.getProductBrands().subscribe(
            (response) => {
                this.productBrands = response.data.brands;
                this.populateBrandNames();
            }
        )
    }

    populateBrandNames() {
        this.products.forEach(prod => {
            this.productBrands.forEach(brand => {
                if (brand.id === prod.brandId) {
                    prod.brandName = brand.name;
                }
            })
        })
    }

    openNewProduct() {
        this.product = new Product();
        this.submitted = false;
        this.productDialog = true;
    }

    saveProduct(product: Product) {
        if (product.id > 0) {
            // update survey
            this.productService.updateProduct(product).pipe(first()).subscribe(
                response => {
                    this.getProducts();
                }
            )
        } else {
            // create new survey
            this.productService.saveProduct(product).pipe(first()).subscribe(
                response => {
                    this.getProducts();
                }
            )
        }
    }


    editProduct(product: Product) {
        this.product = {...product};
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.productService.deleteProduct(product.id).pipe(first()).subscribe(
                    response => {
                        this.getProducts();
                        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
                    }
                )
                
            }
        })
    }

    hideProductDialog() {
        this.productDialog = false;
    }

    validateProductForm() {
        if (this.product.name && this.product.description) {
            this.saveProduct(this.product);
            this.productDialog = false;
        }
    }


}
