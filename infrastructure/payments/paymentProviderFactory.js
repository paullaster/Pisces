import { getPaymentConfig } from "../config/payment.js";
import { NCBAPaymentProvider } from "./NCBAPaymentProvider.js";

export function paymentProviderFactory(provider) {
    try {
        const config = getPaymentConfig(provider);
        switch (provider) {
            case 'NCBA': {
                return new NCBAPaymentProvider(config);
            }
            case 'MPESA': {

            }
            case 'KCB': {

            }
            case 'EQUITY': {

            }
            default: {
                return { success: false, error: 'Invalid payment provider' };
            }
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}