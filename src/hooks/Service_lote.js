import {GET, POST} from "./Connection";
import Cookies from "js-cookie";

export async function all_lote(token){
    let datos = null;
    try{
        datos = await GET('lote', token);
    }
    catch(error){
        return error.response.data;
    }
    return datos.data
}

export async function save_lote(data, token) {
    let datos = null;
    try {
        datos = await POST("lote/guardar", data, token);
        
    } catch (error) {
        return error;
    }
    return datos.data;
}