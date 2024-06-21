import { POST, GET } from "./Connection";

export async function save_photo(data, token) {
    let datos = null;
    try {
        datos = await POST("persona/perfil", data, token);
        
    } catch (error) {
        return error;
    }
    return datos.data;
}

export async function list_photos(token) {
    let datos = null;
    try {
        datos = await GET("media", token);
    } catch (error) {
        return error;
    }
    return datos.data.files; 
}
