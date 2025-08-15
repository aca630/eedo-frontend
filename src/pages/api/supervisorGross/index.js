import axios from "axios"
import Cookies from "js-cookie"

export async function GetSupervisorGross(params) {
    const token = Cookies.get('accessToken')
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/AdminGrossMonitoring?from=${params.from}&to=${params?.to}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }

