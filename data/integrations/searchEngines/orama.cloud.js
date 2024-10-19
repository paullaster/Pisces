import { CloudManager, OramaClient } from "@oramacloud/client";
export class OramaCloud {
    constructor(options = { apiKey, indexId, endpoint, publicApiKey }) {
        this.options = options;
        this.insertSnapshot = this.insertSnapshot.bind(this);
        this.deleteFromIndex = this.deleteFromIndex.bind(this);
        this.updateIndex = this.updateIndex.bind(this);
        this.search = this.search.bind(this);
        this.init = this.init.bind(this);
    }
    init() {
        const manager = new CloudManager({ api_key: this.options.apiKey });
        return manager.index(this.options.indexId);
    }
    async insertSnapshot(snap) {
        try {
            const indexManager = this.init();
            await indexManager.empty();
            const response = await indexManager.insert(snap);
            if (response) {
                const deployed = await indexManager.deploy();
                if (deployed) {
                    return { success: deployed }
                }
                return { success: deployed }
            }
            return { success: response }
        } catch (error) {
            console.error("Failed 1 to insert snapshot", error);
            return { success: false }
        }
    }

    /**
     * 
     * @param {*} snapId -> array
     */
    async deleteFromIndex(snapId) {
        try {
            const indexManager = this.init();
            await indexManager.delete(snapId);
            await indexManager.deploy();
        } catch (error) {
            console.error("Failed to delete snapshot", error);
        }
    }
    async updateIndex(updatedSnap) {
        try {
            const indexManager = this.init();
            await indexManager.update(updatedSnap);
            await indexManager.deploy();
        } catch (error) {
            console.error("Failed to update snapshot", error);
        }
    }
    async deleteAllFromIndex() {
        try {
            const indexManager = this.init();
            await indexManager.empty();
            await indexManager.deploy();
        } catch (error) {
            console.error("Failed to delete all snapshots", error);
        }
    }

    async search(query = {}) {
        try {
            const client = new OramaClient({
                endpoint: this.options.endpoint,
                api_key: this.options.publicApiKey,
            });
            const response = await client.search(query);
            return { success: true, data: response.hits };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
}