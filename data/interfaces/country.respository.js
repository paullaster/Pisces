import axios from "axios"

export class CountryRespository {
    constructor(CountryModel) {
        this.CountryModel = CountryModel;
        this.getAll = this.getAll.bind(this);
        this.setupCountries = this.setupCountries.bind(this);
    }

    async getAll() {
        try {
            const countries = await axios.request({
                method: 'GET',
                url: this.CountryModel,
            });
            return { success: true, data: countries.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async setupCountries(countryData) {
        try {
            await this.CountryModel.bulkCreate(countryData);
            return { success: true, message: 'Countries setup successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}