import axios from "axios";
import Cookies from "js-cookie";



export async function GetCashier(body) {
 
    const token = Cookies.get('accessToken')
    const id = Cookies.get('id')
    const response = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/accountant/cashier?id=${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }


export async function postCashier(body) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/accountant/cashier`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }



  
export async function deleteCashier(id) {
 
    const token = Cookies.get('accountantessToken')
  
    const response =  await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/accountant/cashier/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }