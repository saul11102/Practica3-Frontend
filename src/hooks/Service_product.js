import {GET, POST} from "./Connection";
import Cookies from "js-cookie";

export async function all_product(token){
    console.log(token);
    let datos = null;
    try{
        datos = await GET('producto', token);
    }
    catch(error){
        return error;
    }
    return datos.data
}

export async function all_product_valid(token){
    console.log(token);
    let datos = null;
    try{
        datos = await GET('producto/vigentes', token);
    }
    catch(error){
        return error;
    }
    return datos.data
}

export async function save_product(data, token) {
    let datos = null;
    try {
        datos = await POST("producto/guardar", data, token);
    } catch (error) {
        return error;
    }
    return datos.data;
}