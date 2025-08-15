import axios from "axios";
import Cookies from "js-cookie";



export async function GetCollector(body) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/collector`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }


export async function postCollector(body) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/admin/collector`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }



  
export async function deleteCollector(id) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/collector/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }

  export async function putCollector(body) {

 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/admin/collector/${body?.id}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }