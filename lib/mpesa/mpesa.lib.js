import mpesa from '../../config/mpesa.js';
import { RandomCodeGenerator } from '../../common/generating_unique_codes.js';
import axios from 'axios';
class Mpesa {

    constructor() {
        this.NIPush = this.NIPush.bind(this);
        this.password = this.password.bind(this);
        this.timeStamp = this.timeStamp.bind(this);
        this.formatPhoneNumber = this.formatPhoneNumber.bind(this);
        this.getMpesaToken = this.getMpesaToken.bind(this);
    }
    /**
 * Get M-Pesa Token
 * @returns {string} Promise access_token
 */
    async getMpesaToken(){
        try {
            const joinedKeys = `${mpesa.consumer_key}:${mpesa.consumer_secret}`;
            const configs = {
                url: mpesa.authorization_url,
                method: 'GET',
                headers: {
                    Authorization: `Basic ${new Buffer.from(joinedKeys).toString('base64')}`,
                },
                params: {
                    grant_type: 'client_credentials',
                },
            };
            const response = await axios.request(configs);
            return Promise.resolve(response.data.access_token);
        } catch (error) {
            console.error("at token: ", error);
            return Promise.reject(error);
        }
    }
    /**
 * Submits a transaction to the M-Pesa Express API
 * @param {object} transaction the transaction details
 * @param {string} transaction.phoneNumber the phone number of the recipient
 * @param {number} transaction.amount the amount to be transacted
 * @param {string} transaction.TransactionType the type of transaction
 * @param {string} [transaction.TransactionDesc] a description of the transaction
 * @returns {object} the M-Pesa Express API response
 */
     async NIPush(transaction){
        try {
            const token = await this.getMpesaToken();
            const body = {
                BusinessShortCode: mpesa.business_shortcode,
                Password: await this.password(),
                Timestamp: await this.timeStamp(),
                TransactionType: transaction.TransactionType,
                Amount: `${transaction.amount}`,
                PartyA: await this.formatPhoneNumber(transaction.phoneNumber),
                PartyB: mpesa.business_shortcode,
                PhoneNumber: await this.formatPhoneNumber(transaction.phoneNumber),
                CallBackURL: mpesa.mpesa_callback,
                TransactionDesc: transaction.TransactionDesc
            };
            let transactionId = RandomCodeGenerator(12,'') 
            if (transaction.TransactionType !== 'CustomerBuyGoodsOnline') {
                body.AccountReference = transactionId;
            }
            const response = await axios.request({
                url: mpesa.express_api_url, 
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: body,
                method: 'POST'
            });
            const data =  response.data;
            data.transId = transactionId
            return {success: true, transaction: data};
        } catch (error) {
            console.error("error at push : ", error);
            return {success: false, error: error};
        }
    }
    /**
 * Returns a base64 encoded string of the M-Pesa password
 * @returns {string} base64 encoded M-Pesa password
 */
    async password(){
        try {
            const stringToEncode = `${mpesa.business_shortcode}${mpesa.mpesa_passkey}${await this.timeStamp()}`;
            return new Buffer.from(stringToEncode).toString('base64');
        } catch (error) {
            throw new Error (error.message);
        }
    }
    /**
 * Returns a timestamp in the format YYYYMMDDhhmmss
 * @returns {string} timestamp
 */
    async timeStamp(){
        try {
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
            const day = now.getDate() < 10 ? '0' + (now.getDate()) : now.getDate();
            const hour = now.getHours() < 10 ? '0' + (now.getHours()) : now.getHours();
            const minute = now.getMinutes() < 10 ? '0' + (now.getMinutes()) : now.getMinutes();
            const second = now.getSeconds() < 10 ? '0' + (now.getSeconds()) : now.getSeconds();
            return `${year}${month}${day}${hour}${minute}${second}`;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    /**
 * Formats a phone number for use with the M-Pesa API.
 *
 * @param {string} phoneNumber - The phone number to format.
 * @returns {string} The formatted phone number.
 */
    async formatPhoneNumber(phoneNumber){
        const firstChar = phoneNumber.charAt(0);
        switch (firstChar) {
            case '0':
                return `254${phoneNumber.slice(1)}`;
            case '+':
                return phoneNumber.slice(1);
            case "7":
                return phoneNumber.length < 10 ? `254${phoneNumber}` : phoneNumber;
            default: return phoneNumber;
        }
    }
}

export { Mpesa }