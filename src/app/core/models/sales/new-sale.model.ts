export type NewSaleModel = {
    reference: string,
    deliveryDate: Date,
    deliveryAddress: string,
    deliveryPhoneNumber: string,
    extraInformation: string,
    productInstanceIds: string[],
}
