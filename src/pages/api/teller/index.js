import axios from "axios";
import Cookies from "js-cookie";



export async function GetTeller(body) {
 
    const token = Cookies.get('accessToken')
    const id = Cookies.get('id')

    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/accountant/teller?id=${id}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }


export async function postTeller(body) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/accountant/teller`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }



  
export async function deleteTeller(id) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/accountant/teller/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }


  export async function ApiUpdateTellerStatus(body) {

    console.log(body);
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/teller/updateStatus/${body.id}`,body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      return response
    
  }



  export async function ApiResetTellerPassword(body) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/teller/updatePassword/${body.id}`,body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      return response
    
  }



  export async function putTeller(body) {
 
    const token = Cookies.get('accessToken')
    const response =  await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/accountant/teller/${body.id}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }

