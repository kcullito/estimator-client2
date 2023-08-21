import { LineItem } from "./line-item.model";

export class LineCategory {
    id: number;
    pos: number;
    name: string;
    description: string;
    total: number;
    categoryId: number;
    lineItems: LineItem[];
}
