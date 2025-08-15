import axios from "axios"
import Cookies from "js-cookie"

export async function GetTellerVoids(params) {
    const token = Cookies.get('accessToken')
    const id = Cookies.get('id')
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/accountant/AccountantTellerVoids?id=${id}&from=${params.from}&to=${params?.to}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }

