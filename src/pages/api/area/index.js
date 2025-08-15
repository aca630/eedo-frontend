import axios from "axios";
import Cookies from "js-cookie";



export async function GetArea(body) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/area`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }


export async function postArea(body) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/admin/area`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }



  
export async function deleteArea(id) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/area/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }

  export async function putArea(body) {

 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/admin/area/${body?.id}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }