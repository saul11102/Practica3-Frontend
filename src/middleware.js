import { NextResponse } from "next/server";
import Cookies from 'js-cookie';
export default function middleware(request){
    
    let token = request.cookies.get ('token');
    let usuario = request.cookies.get('usuario');

    if (GET(token).data == 200) {
        return NextResponse.redirect('http://localhost:3000/sessions');
    }
    return NextResponse.next();
}

export const config={
    matcher:'/dashboard/:path*'
}

export const GET = async (token = "NONE") => {
    let headers = {
        headers: {
            "Accept": "application/json",
        }
    }
    if (token != "NONE") {
        headers = {
            headers: {
                "Accept": "application/json",
                "X-Access-Token": token,
            }
        }
    }
    return await axios.get(URL + '/validarToken`', headers);
}