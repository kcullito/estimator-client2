/**
 * @author  Misty Mountain Apps LLC
 * @version 1.0
 * @since   7/24/2023
 */

import { Estimate } from "./estimate.model";
import { FileDetail } from "./file-detail.model";

export class Customer {
    id: number;
    firstName: string;
    lastName: string;
    phone1: string;
    email1: string;

    firstName2: string;
    lastName2: string;
    phone2: string;
    email2: string;

    displayName: string;
    description: string;

    address: string;
    city: string;
    state: string;
    zipCode: number;
    
    selected: boolean;
    estimates: Estimate[]
    fileDetails: FileDetail[];

}
