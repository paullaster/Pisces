import Joi from "joi";
import sanitizeHtml from "sanitize-html";
export class JoiSanitizer {
  cleanMpesaCheckout(mpesaCheckoutSchema) {
    const schema = Joi.object({
      checkoutId: Joi.string().required(),
      phoneNumber: Joi.string().pattern(/^\+\d{1,2}\s?\d{4,14}$/).required(),
    });
    for (let prop in mpesaCheckoutSchema) {
      mpesaCheckoutSchema[prop] = sanitizeHtml(mpesaCheckoutSchema[prop]);
    }
    return schema.validate(mpesaCheckoutSchema);
  }
  validateAddress(address) {
    const schema = Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      country: Joi.string().required(),
      zip: Joi.string().required(),
      appartment: Joi.string().required(),
      streetCode: Joi.string().allow('').optional(),
      address: Joi.string().optional(),
      longitude: Joi.string().optional(),
      latitude: Joi.string().optional(),
      town: Joi.string().required(),
    });
    for ( let prop in address ) {
      address[prop] = sanitizeHtml(address[prop]);
    }
    return schema.validate(address);
  }
  sanitizeObject(obj) {
    for ( let prop in obj ) {
      // obj[prop] = sanitizeHtml(obj[prop]);
      if (typeof obj[prop] === "object") {
        this.sanitizeObject(obj[prop]);
      }
      if (Array.isArray(obj[prop])) {
        obj[prop] = obj[prop].map((item) => {
          if (typeof item === "object") {
            this.sanitizeObject(item);
          }
          return sanitizeHtml(item);
        });
      }
      if (typeof obj[prop] === "string") {
        obj[prop] = sanitizeHtml(obj[prop]);
      }
      if (typeof obj[prop] === "undefined") {
        delete obj[prop];
      }
      if (obj[prop] === "") {
        delete obj[prop];
      }
      if (obj[prop] === null) {
        delete obj[prop];
      }
      if (typeof obj[prop] === "function") {
        delete obj[prop];
      }
      if (typeof obj[prop] === "symbol") {
        delete obj[prop];
      }
      if (obj[prop] === Infinity) {
        obj[prop] = "Infinity";
      }
      if (obj[prop] === -Infinity) {
        obj[prop] = "-Infinity";
      }
      if (obj[prop] === isNaN) {
        obj[prop] = "NaN";
      }
    }
    return obj;
  }
}