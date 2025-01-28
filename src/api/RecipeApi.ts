import { SuccessCode } from '@/constants/Constants';
import axios from 'axios'

class RecipeApi {
    async fetch(skip: number, limit: number, search = '', sortBy = '', orderBy = '') {
        try {
            let baseUrl = `https://dummyjson.com/recipes`
            const sortFilter = sortBy && orderBy ? `&sortBy=${sortBy}&order=${orderBy}` : '';
            let url = search ? `${baseUrl}/search?limit=${limit}&skip=${skip}${sortFilter}&q=${search}` :
            `${baseUrl}?limit=${limit}&skip=${skip}${sortFilter}`;

            const response = await axios.get(url)
            if (response.status === SuccessCode) {
                return response.data;
            }
            return [];
        } catch (error) {
            return [];
        }
    }
}

export default new RecipeApi();