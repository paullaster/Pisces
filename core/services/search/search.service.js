export class SearchService {
    constructor(searchEngine) {
        this.searchEngine = searchEngine;
        this.search = this.search.bind(this);
        this.updateIndex = this.updateIndex.bind(this);
        this.deleteAllFromIndex = this.deleteAllFromIndex.bind(this);
        this.insertSnapshot = this.insertSnapshot.bind(this);
        this.deleteFromIndex = this.deleteFromIndex.bind(this);
    }

    async search(query = {}) {
        try {
            const {success, error, data:results} = await this.searchEngine.search(query);
            if (!success) {
                return { success: false, error };
            }
            return { success: true, results };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async updateIndex(batchPayload) {
        try {
            await this.searchEngine.updateIndex(batchPayload);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async deleteFromIndex(pid) {
        try {
            await this.searchEngine.deleteFromIndex(pid);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async deleteAllFromIndex() {
        try {
            await this.searchEngine.deleteAllFromIndex();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async insertSnapshot(snapshot) {
        try {
            const {success } = await this.searchEngine.insertSnapshot(snapshot);
            return { success};
        } catch (error) {
            console.log("Error inserting snapshot", error);
            return { success: false, error: error.message };
        }
    }
}