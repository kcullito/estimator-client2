export class Product {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    dimensions: string;
    brandId: number;

    /* 
        These fields are not in the database 
        or accessible through the api. They
        are convenience fields populated in
        the product component.
    */
    brandName: string;
    
}
