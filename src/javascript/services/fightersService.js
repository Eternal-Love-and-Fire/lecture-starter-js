import callApi from '../helpers/apiHelper';

class FighterService {
    #endpoint = 'fighters.json';

    async getFighters() {
        try {
            const apiResult = await callApi(this.#endpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }

    async getFighterDetails(id) {
        try {
            // I do it because linter want this from me :..)
            const fighterEndpoint = this.#endpoint.slice(0, 8);
            const apiResult = await callApi(`details/${fighterEndpoint}/${id}.json`);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }
}

const fighterService = new FighterService();

export default fighterService;
