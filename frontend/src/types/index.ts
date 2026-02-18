export interface Product {
    id?: number;
    code: string;
    name: string;
    price: number;
}

export interface RawMaterial {
    id?: number;
    code: string;
    name: string;
    stockQuantity: number;
}

export interface ProductRawMaterial {
    id?: number;
    productId: number;
    rawMaterialId: number;
    quantityNeeded: number;
    rawMaterial?: RawMaterial;
}

export interface ProductionSuggestion {
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
    totalValue: number;
}