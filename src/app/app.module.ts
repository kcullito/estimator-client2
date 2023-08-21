import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { JwtInterceptor } from './_interceptors/jwt-interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';

/* primeng components */
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { KeyFilterModule } from 'primeng/keyfilter';
import { AppLayoutComponent } from './_layouts/app-layout/app-layout.component';
import { AppHeaderComponent } from './_layouts/app-header/app-header.component';
import { AppFooterComponent } from './_layouts/app-footer/app-footer.component';
import { FocusTrapModule } from 'primeng/focustrap';
import { HomeComponent } from './home/home.component';
import { StyleClassModule } from 'primeng/styleclass';
import { RippleModule } from 'primeng/ripple';
import { AutoFocusModule } from 'primeng/autofocus';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CustomersComponent } from './customers/customers.component';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import { DialogModule } from 'primeng/dialog';
import { EstimatesComponent } from './estimates/estimates/estimates.component';
import { EditEstimateComponent } from './estimates/edit-estimate/edit-estimate.component';
import { CategoryComponent } from './records/estimate/category/category.component';
import { CostTypeComponent } from './records/estimate/cost-type/cost-type.component';
import { EstimateStatusComponent } from './records/estimate/estimate-status/estimate-status.component';
import { EstimateTypeComponent } from './records/estimate/estimate-type/estimate-type.component';
import { RecordTypeComponent } from './records/estimate/record-type/record-type.component';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CompanyComponent } from './records/company/company.component';
import { GenerateEstimateComponent } from './estimates/generate-estimate/generate-estimate.component';
import { RegisterComponent } from './admin/register/register.component';
import { SecurityComponent } from './admin/security/security.component';
import { SplitterModule } from 'primeng/splitter';
import { ChartModule } from 'primeng/chart';
import { ResetPwdComponent } from './login/reset-pwd/reset-pwd.component';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { RolesComponent } from './admin/roles/roles.component';
import { ReportsComponent } from './analysis/reports/reports.component';
import { ScrollTopModule } from 'primeng/scrolltop';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { SpeedDialModule } from 'primeng/speeddial';
import { ErrorInterceptor } from './_interceptors/error-interceptor';
import { LayoutComponent } from './surveys/layout/layout.component';
import { SurveyComponent } from './surveys/survey/survey.component';
import { QuestionsComponent } from './surveys/questions/questions.component';
import { AnswersComponent } from './surveys/answers/answers.component';
import { SourcesComponent } from './surveys/sources/sources.component';
import { ProductComponent } from './products/product/product.component';
import { ProductBrandComponent } from './products/product-brand/product-brand.component';
import { ProductLayoutComponent } from './products/layout/product-layout.component';
import { EstimateLayoutComponent } from './records/estimate/estimate-layout/estimate-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AppLayoutComponent,
    AppHeaderComponent,
    AppFooterComponent,
    HomeComponent,
    CustomersComponent,
    EstimatesComponent,
    EditEstimateComponent,
    CategoryComponent,
    CostTypeComponent,
    EstimateStatusComponent,
    EstimateTypeComponent,
    RecordTypeComponent,
    CompanyComponent,
    GenerateEstimateComponent,
    RegisterComponent,
    SecurityComponent,
    ResetPwdComponent,
    RolesComponent,
    ReportsComponent,
    LayoutComponent,
    SurveyComponent,
    QuestionsComponent,
    AnswersComponent,
    SourcesComponent,
    ProductComponent,
    ProductBrandComponent,
    ProductLayoutComponent,
    EstimateLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastModule,
    TabViewModule,
    InputTextModule,
    InputMaskModule,
    KeyFilterModule,
    FocusTrapModule,
    StyleClassModule,
    RippleModule,
    AutoFocusModule,
    PanelModule,
    ButtonModule,
    MenubarModule,
    AvatarModule,
    ConfirmDialogModule,
    ToolbarModule,
    TableModule,
    MessagesModule,
    DialogModule,
    CheckboxModule,
    DropdownModule,
    InputTextareaModule,
    SplitterModule,
    ChartModule,
    PasswordModule,
    DividerModule,
    ScrollTopModule,
    InputNumberModule,
    CardModule,
    SpeedDialModule


  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MessageService },
    { provide: ConfirmationService },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
