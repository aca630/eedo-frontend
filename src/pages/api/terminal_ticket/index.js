import axios from "axios";
import Cookies from "js-cookie";



export async function Get_TerminalTicketByID(id) {
 
    const token = Cookies.get('accessToken')
  

    
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/despense_ticket/${id}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }


  export async function Put_TerminalTicket(body) {

 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/admin/despense_ticket/${body?.id}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }