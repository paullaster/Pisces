export class ValidateObjectPayload {
    constructor(object) {
        if(!this.isValidPayload(object)) {
            throw new Error('Invalid payload');
        }
        this.object = object;
    }
    isValidPayload(object) {
        for( let prop in object ) {
            return !(!object[prop]);
        }
    }
}