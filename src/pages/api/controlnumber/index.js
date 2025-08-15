import axios from "axios"
import Cookies from "js-cookie"


export async function GetControlNumber(body) {

    const token = Cookies.get('accessToken')
    const id = Cookies.get('id')
    const response = await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/controlnumbers?accountantId=${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })


    return response

}

export async function postControlNumber(body) {

   
    const token = Cookies.get('accessToken')

    const response = await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/admin/controlnumbers`, body, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })


    return response

}


export async function deleteControlNumber(id) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/controlnumbers/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }