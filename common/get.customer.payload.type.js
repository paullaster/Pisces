export const valueType = (value) => {
    if(/^\S+@\S+\.\S+$/.test(value)){
        return {type: "email", value: value};
    }
    if(Array.isArray(value)){
        return {type: "array", value: value};
    }
    if(typeof value === "object"){
        return {type: "object", value: value};
    }
    if(typeof value === "boolean"){
        return {type: "boolean", value: value};
    }
    if(Number.isInteger(value)){
        return {type: "number", value: value};
    }
    if(typeof value === "string"){
        const regX =/^\d{7,25}$/
        if(regX.test(value.substring(1).split(' ').join(''))) {
            return {type: "phone", value: value};
        }
        return {type: "string", value: value};
    }

    return {type: "unknown", value: value};
}