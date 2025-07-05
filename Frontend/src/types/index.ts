export interface Order {
    _id: string;
    customerId: Customer;
    productId: Product;
    quantityOrdered: number;
    quantityDelivered: number;
    remainingQuantity: number;
    orderDate: string;
    deliveryDate: string;
    sellingPrice: number;
    deliveryCost: number;
    orderCompletionDate?: string;
    status: 'In Progress' | 'Completed';
  }
  
  export interface Customer {
    _id: string;
    customerName: string;
    contactPerson: string;
    phoneNumber: string;
    email: string;
    companyAddress: string;
    gstNumber: string;
    fssaiNumber: string;
    cinNumber: string;
    preferredPaymentTerms: string;
    creditOfPayment: string;
    orderFrequency: string;
  }
  
  export interface Product {
    _id: string;
    productId: string;
    productName: string;
    productCategory: string;
    productSKU: string;
    sellingPrice: number;
    currentStock: number;
    minimumStockLevel: number;
  }