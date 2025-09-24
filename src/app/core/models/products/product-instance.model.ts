export type ProductInstance = {
    instanceId: string,
    rootProductId: string,
    width: number | null,
    length: number | null,
    height: number | null,
    colour: string | null,
    reserved: boolean,
    savedAt: Date
}
