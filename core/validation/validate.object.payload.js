export class ValidateObjectPayload {
    constructor(object) {
        if(!this.isValidPayload(object)) {
            throw new Error('Invalid payload');
        }
        this.object = object;
    }
    isValidPayload(object) {
        for( let prop in object ) {
            if(!object[prop]) {
                return false;
            }
            return true;
        }
    }
}