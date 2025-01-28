import { SuccessCode } from '@/constants/Constants';
import axios from 'axios'

class RecipeApi {
    async fetch(skip: number, limit: number, search = '', sortBy = '', orderBy = '', filterBy='', filter='') {
        try {
            let baseUrl = `https://dummyjson.com/recipes`
            let url = '';
            const sortFilter = sortBy && orderBy ? `&sortBy=${sortBy}&order=${orderBy}` : '';
            if (search) {
                url = `${baseUrl}/search?limit=${limit}&skip=${skip}${sortFilter}&q=${search}`;
            } else if (filterBy && filter) {
                url = `${baseUrl}/${filterBy}/${filter}?limit=${limit}&skip=${skip}${sortFilter}`;
            } else {
                url = `${baseUrl}?limit=${limit}&skip=${skip}${sortFilter}`;
            }

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