import axios from "axios";
import Cookies from "js-cookie";



export async function GetSection(body) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/section`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }


export async function postSection(body) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/admin/section`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }



  
export async function deleteSection(id) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/section/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }

  export async function putSection(body) {

 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/admin/section/${body?.id}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }