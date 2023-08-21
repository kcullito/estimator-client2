/**
 * @author  Misty Mountain Apps LLC
 * @version 1.0
 * @since   7/24/2023
 */

import { LineCategory } from "./line-category.model";

export class EstimateDetail {
    id: number;
    version: number;
    description: string;
    estimateTypeId: number;
    customerId: number;
    subtotalAmt: number;
    salesTax: number;
    salesTaxAmt: number;
    totalAmt: number;
    statusId: number;
    updated: Date;
    notes: string;
    adminMessage: string;
    adminPercent: number;
    adminAmount: number;
    lineCategories: LineCategory[];

}
