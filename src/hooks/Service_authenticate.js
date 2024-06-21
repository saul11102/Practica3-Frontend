import { POST } from "./Connection";

export async function login(data) {
    let datos = null;
    try {
        datos = await POST("session", data);
        
    } catch (error) {
        return error;
    }
    return datos.data;
}