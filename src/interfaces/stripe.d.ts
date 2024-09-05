interface StripeUserData {
    fullName: string;
    email: string;
    phoneNumber: string;
}

export interface CreateIntentRequestBody {
    amount: number;
    userData: StripeUserData;
}
