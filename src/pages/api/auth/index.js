import Cookies from "js-cookie";



export async function Auth(route) {
    console.log(Cookies.get("accessToken"));
    
    if (Cookies.get("accessToken") == undefined) {
        return '/'
    } else {

        return route;

    }

}