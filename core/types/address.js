export class Address {
    constructor(address) {
        for (let key in address) {
            this[key] = address[key];
        }
    }
}