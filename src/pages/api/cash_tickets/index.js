import axios from "axios";
import Cookies from "js-cookie";



export async function GetCash_Tikets(body) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/cash_ticket`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }


export async function postCash_Tikets(body) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/admin/cash_ticket`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }



  
export async function deleteCash_Tikets(id) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/cash_ticket/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }

  export async function putCash_Tikets(body) {

 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/admin/cash_ticket/${body?.id}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }