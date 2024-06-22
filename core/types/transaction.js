export class Transaction {
    constructor(transaction) {
        for (let prop in transaction) {
            this[prop] = transaction[prop];
        }
    }
}