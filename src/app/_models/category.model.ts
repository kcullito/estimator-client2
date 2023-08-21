import { RecordType } from "./record-type.model";

/**
 * @author  Misty Mountain Apps LLC
 * @version 1.0
 * @since   7/24/2023
 */

export class Category {
    id : number;
    name : string;
    description : string;
    recordTypes: RecordType[] = [];
    selected: boolean;

}
