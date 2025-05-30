import { error } from "console";

const BaseUrl = import.meta.env.VITE_BACKEND_URL

export const getToken = async (chainId: any, jwt: any) => {
    try {
        const res = await fetch(`${BaseUrl}/api/v1/supported-tokens/${chainId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`

            }
        })
        const response = await res.json();
        return response.data;
    } catch (err) {
        throw new Error(err)
    }
}

