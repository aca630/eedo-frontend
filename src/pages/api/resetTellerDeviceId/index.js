import axios from "axios";
import Cookies from "js-cookie";


  export async function ApiResetTellerDeviceId(body) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/admin/resetTellerDeviceId/${body.id}`,body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      return response
    
  }

