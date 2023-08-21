import { Customer } from "./customer.model";
import { EstimateDetail } from "./estimate-detail.model";
import { EstimateType } from "./estimate-type.model";

export class Estimate {
    id:                     number;
    userId:                 number;
    currentVersion:         number;
    estimateName:           string;
    description:            string;
    estimateType:           EstimateType;
    estimateTypeId:         number;
    customer:               Customer;
    customerId:             number;
    customerName:           string;
    subtotalAmt:            number;
    salesTax:               number;
    salesTaxAmt:            number;
    totalAmt:               number;
    statusId:               number;
    statusName:             string;
    updated:                Date;
    notes:                  string;
    logo:                   string;
    banner:                 string;
    estimateDetails:        EstimateDetail[];
    estimator:              string;
    estimateTypeString:     string;
    includeTitlePage:       boolean;
    includeSummaryPage:     boolean;
    adminMessage:           string;
    adminPercent:           number;
    includeAdmin:           boolean;

}
