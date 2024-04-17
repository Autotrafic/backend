export interface Vehicle {
    plate: string;
    vehicleType: number;
    salePrice: number;
    registrationDate: string;
}

export interface Person {
    phoneNumber: string;
}

export interface Customer extends Person {
    community: string;
    fullName: string;
    email: string;
}

export interface Order {
    shippingAddress: string;
    itpPrice: number;
    totalPrice: number;
}

export interface OrderData {
    vehicle: Vehicle;
    buyer: Person;
    seller: Person;
    customer: Customer;
    order: Order;
}
