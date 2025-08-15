import axios from "axios";
import Cookies from "js-cookie";



export async function GetOccupant(body) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/occupant`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }


export async function postOccupant(body) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/admin/occupant`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }



  
export async function deleteOccupant(id) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/occupant/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }

  export async function putOccupant(body) {

 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/admin/occupant/${body?.id}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }