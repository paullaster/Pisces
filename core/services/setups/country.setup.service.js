export class CountriesSetupService {
    constructor(countriesRepository) {
        this.countriesRepository = countriesRepository;
        this.setupCountries = this.setupCountries.bind(this);
        this.getCountries = this.getCountries.bind(this);
    }

    async getCountries() {
        try {
            const { success, error, data: countries } = await this.countriesRepository.getAll();
            if (!success) {
                return { success: false, error };
            }
            return { success: true, countries };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async setupCountries() {
        try {
            const { success, error, data: countries } = await this.countriesRepository.getAll();
            if (!success) {
                return { success: false, error };
            }

            const countryData = countries.map((country) => ({
                country_id: country.id,
                country_name: country.name,
                country_code: country.alpha2Code,
            }));

            await this.countriesRepository.setupCountries(countryData);

            return { success: true, message: 'Countries setup successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}