import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './_services/auth-guard.service';
import { LoginComponent } from './login/login.component';
import { AppLayoutComponent } from './_layouts/app-layout/app-layout.component';
import { HomeComponent } from './home/home.component';
import { CustomersComponent } from './customers/customers.component';
import { EstimatesComponent } from './estimates/estimates/estimates.component';
import { CategoryComponent } from './records/estimate/category/category.component';
import { CostTypeComponent } from './records/estimate/cost-type/cost-type.component';
import { EstimateStatusComponent } from './records/estimate/estimate-status/estimate-status.component';
import { EstimateTypeComponent } from './records/estimate/estimate-type/estimate-type.component';
import { RecordTypeComponent } from './records/estimate/record-type/record-type.component';
import { CompanyComponent } from './records/company/company.component';
import { EditEstimateComponent } from './estimates/edit-estimate/edit-estimate.component';
import { GenerateEstimateComponent } from './estimates/generate-estimate/generate-estimate.component';
import { RegisterComponent } from './admin/register/register.component';
import { RolesComponent } from './admin/roles/roles.component';
import { ReportsComponent } from './analysis/reports/reports.component';
import { LayoutComponent } from './surveys/layout/layout.component';
import { ProductLayoutComponent } from './products/layout/product-layout.component';
import { EstimateLayoutComponent } from './records/estimate/estimate-layout/estimate-layout.component';

const routes: Routes = [
    { 
        path: '', component: AppLayoutComponent, canActivateChild: [AuthGuardService],
            children: [
                { path: '', component: HomeComponent },
                { path: 'home', component: HomeComponent },
                { path: 'customers', component: CustomersComponent },
                { path: 'estimates', component: EstimatesComponent },
                { path: 'categories', component: CategoryComponent },
                { path: 'cost-types', component: CostTypeComponent },
                { path: 'estimate-status', component: EstimateStatusComponent },
                { path: 'estimate-types', component: EstimateTypeComponent },
                { path: 'record-types', component: RecordTypeComponent },
                { path: 'company', component: CompanyComponent },
                { path: 'edit-estimate', component: EditEstimateComponent },
                { path: 'edit-estimate/:id', component: EditEstimateComponent },
                { path: 'generate-estimate', component: GenerateEstimateComponent },
                { path: 'register', component: RegisterComponent },
                { path: 'roles', component: RolesComponent },
                { path: 'reports', component: ReportsComponent },
                { path: 'surveys', component: LayoutComponent },
                { path: 'products', component: ProductLayoutComponent },
                { path: 'estimate-records', component: EstimateLayoutComponent },
                
                /*
                { path: 'surveys', component: SurveysComponent },
                { path: 'products', component: ProductsComponent },
                { path: 'product-brands', component: ProductBrandsComponent },
                { path: 'guide', component: GuideComponent },
                { path: 'security', component: SecurityComponent },
                { path: 'calendar', component: CalendarComponent },
                
                */
                //{ path: '**', redirectTo: '' }
        ],
    },
    //{ path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
