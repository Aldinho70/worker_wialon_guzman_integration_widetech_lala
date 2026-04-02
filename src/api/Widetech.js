import axios from "axios";

export class APIWideTech {
    constructor() {
        this.client = axios.create({
            baseURL: "http://locationreporter.shareservice.co/API/rest",
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 10000
        });

        this.auth = null;
    }

    // 🔐 LOGIN
    async loginUser({ strLogin, strPassword, intLang = 1 }) {
        try {
            const response = await this.client.post("/LoginUser", {
                strLogin,
                strPassword,
                intLang
            });

            //   this.auth = {
            //     Token: data.Token,
            //     Sign: data.Sign,
            //     ExpirationDate: data.ExpirationDate
            //   };

            return response;
        } catch (error) {
            console.error("Error en loginUser:", error.response?.data || error.message);
            throw error;
        }
    }

    // 📍 SEND LOCATION
    async sendLocation(response_login, locations = []) {
        const { Token, Sign, ExpirationDate } = response_login || {};

        if (!Token || !Sign || !ExpirationDate) {
            throw new Error("Auth inválido o incompleto");
        }

        const requests = locations.map((locationPayload) => {
            const body = {
                AuthObj: {
                    Err: {
                        Code: "0",
                        Desc: "OK"
                    },
                    ExpirationDate,
                    Sign,
                    Token
                },
                objLocReporter: locationPayload
            };

            return this.client.post("/SendLocation", body);
        });

        try {
            const responses = await Promise.allSettled(requests);

            return responses.map((res, index) => {
                const isSuccess = res.status === "fulfilled";

                return {
                    unidad: locations[index]?.strAlias ?? "Sin alias",
                    success: isSuccess,
                    message: isSuccess
                        ? "Paquete enviado correctamente"
                        : "Error al enviar el paquete",
                    detail: isSuccess
                        ? "OK"
                        : res.reason?.response?.data || res.reason?.message || "Error desconocido"
                };
            });
        } catch (error) {
            console.error("Error en sendLocations:", error.message);
            throw error;
        }
    }
}