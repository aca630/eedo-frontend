import axios from "axios";
import Cookies from "js-cookie";



export async function GetVoid_monthly_rental(body) {
 
    const token = Cookies.get('accessToken')
  
    
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/void_monthly_rental?stall_no=${body?.stall_no}&or_number=${body?.or_number}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }

  export async function VoidMonthlyPayment(body) {

 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/admin/void_monthly_rental/${body?.id}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }