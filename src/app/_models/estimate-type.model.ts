import { Category } from "./category.model";

export class EstimateType {
    id: number;
    name: string;
    description: string;
    categories: Category[];
    selected: boolean;

}
