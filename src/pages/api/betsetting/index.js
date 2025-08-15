import axios from "axios"
import Cookies from "js-cookie"


export async function GetBetsetting(body) {

    const token = Cookies.get('accessToken')

    const response = await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/betsetting?type=${body?.type}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })


    return response

}

export async function postBettsetting(body) {

   
    const token = Cookies.get('accessToken')

    const response = await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/admin/betsetting`, body, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })


    return response

}


export async function deleteBetsetting(id) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/betsetting/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }