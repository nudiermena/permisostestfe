import Axios from "axios";

const baseUrl = "http://localhost:50462/api/Permission";
const baseUrlPermissionType = "http://localhost:50462/api/PermissionType";

export class RestDataSource {
    constructor(bus) {
        this.eventBus = bus;

    }

    async get() {
        return (await this.sendRequest("GET", baseUrl)).data;
    }

    async getById(id) {
        return (await this.sendRequest("GET", `${baseUrl}/${id}`)).data;
    }

    async getPermissionTypes() {
        return (await this.sendRequest("GET", baseUrlPermissionType)).data;
    }

    async save(permission) {
        await this.sendRequest("POST", baseUrl, permission);
        // const response = await Axios.post(baseUrl, permission);
        // console.log(response);
    }

    async update(permission) {
        console.log("update data", permission);
        await this.sendRequest("PUT", `${baseUrl}/${permission.permissionId}`, permission);
    }

    async delete(permission) {
        await this.sendRequest("DELETE", `${baseUrl}/${permission.permissionId}`);
    }

    async sendRequest(httpMethod, url, permission) {
        try {

            return await Axios.request({
                method: httpMethod,
                url: url,
                data: permission
            });
        } catch (err) {
            if (err.response) {
                this.eventBus.$emit("httpError",
                    `${err.response.statusText} - ${err.response.status}`);
            } else {
                this.eventBus.$emit("httpError", "HTTP Error");
            }
            throw err;
        }
    }
}