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
}