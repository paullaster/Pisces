 export class User {
    constructor(Obj) {
        for(const prop in Obj) {
            this[prop] = Obj[prop];
        }
    };
};
