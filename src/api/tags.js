import axios from "axios";
import api from ".";
import { settings } from "@/library/variables";

export const tags = {
    async get(id) {
        if (id) {
            return await axios.get(
                settings.baseURL + "/properties/" + settings.propertyID + "/tags/" + id
            );
        } else {
            return await axios.get(
                settings.baseURL + "/properties/" + settings.propertyID + "/tags"
            );
        }
    },
    async create(payload) {
        return await axios
            .post(settings.baseURL + "/properties/" + settings.propertyID + "/tags", payload)
            .catch(error => {
                return api.response.error(error.response.data);
            });
    },
    async update(id, payload) {
        return await axios
            .patch(settings.baseURL + "/properties/" + settings.propertyID + "/tags/" + id, payload)
            .catch(error => {
                return api.response.error(error.response.data);
            });
    },
    async delete(id) {
        return await axios
            .delete(settings.baseURL + "/properties/" + settings.propertyID + "/tags/" + id, null)
            .catch(error => {
                return api.response.error(error.response.data);
            });
        },
    async getShowTypes() {
        return await axios.get(
            settings.baseURL + "/properties/" + settings.propertyID + "/tags/show-type"
        );
    }
};