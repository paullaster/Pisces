import IORedis from 'ioredis';
import { safeTypeChecker } from '../../common/safeTypeChecker.js';

const connection = new IORedis({ maxRetriesPerRequest: null });

export class NCBAPaymentProvider {
    #config;
    constructor(config) {
        this.#config = config;
    }
    async getAccessToken() {
        try {
            const cachedToken = await connection.getex('NCBA_PAYMENT_AUTH_ACCESS_TOKEN');
            if (cachedToken) {
                return cachedToken;
            }
            const url = `${this.#config.baseUrl}/payments/api/v1/auth/token`;
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${Buffer.from(`${this.#config.username}:${this.#config.password}`).toString('base64')}`,
                }
            });
            const response = await res.json();
            if (!response.ok) {
                return { success: false, error: response.message }
            }
            await connection.setex('NCBA_PAYMENT_AUTH_ACCESS_TOKEN', response.expires_in, response.access_token, (error) => {
                return { success: false, error: error?.message }
            });
            return response.access_token;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async b2cSTKPush(payment) {
        try {
            if (!payment || safeTypeChecker(payment) !== 'Object') {
                return { success: false, error: 'Invalid payment request' };
            }
            const validationResult = {
                isValid: true,
                missingProperty: '',
            };

            for (const [key, value] of Object.entries(payment)) {
                if (safeTypeChecker(value) === 'Null' || safeTypeChecker(value) === 'Undefined') {
                    validationResult.isValid = false;
                    validationResult.missingProperty = key;
                    break;
                }
            }
            if (!validationResult.isValid) {
                return { success: false, error: `Missing required ${validationResult.missingProperty} property` };
            }
            const url = `${this.#config.baseUrl}/payments/api/v1/stk-push/initiate`;
            const token = await this.getAccessToken();
            payment['Network'] = 'Safaricom';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `(Bearer ${token}`,
                    ContentType: 'application/json',
                    'X-Payment-ID': '',
                },
                body: JSON.stringify(payment),
            });
            if (!response.ok) {
                return { success: false, error: response?.statusText };
            }
            const result = await response.json();
            if (result.StatusCode !== '0') {
                return { success: false, error: result.StatusDescription };
            }
            return { success: true, message: result.StatusDescription, payment: result };
        } catch (error) {
            return { success: false, error: error?.message };
        }
    }
    async queryTransaction(transaction) {
        try {
            if (!transaction || safeTypeChecker(transaction) !== 'Object') {
                return { success: false, error: 'Invalid query' };
            }
            if (!('TransactionID' in transaction) || !transaction['TransactionID']) {
                return { success: false, error: 'Invalid transaction ID' }
            }
            const token = await this.getAccessToken();
            const url = `${this.#config.baseUrl}/payments/api/v1/stk-push/query`;
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(transaction)
            });
            if (!res.ok) {
                return { success: false, error: res.statusText };
            }
            const response = await res.json();
            if (response.status === 'FAILED') {
                return { success: false, error: response.description };
            }
            return { success: true, message: response.description };
        } catch (error) {
            return { success: false, error: error?.message };
        }
    }
}