import axios from "axios";
import Cookies from "js-cookie";



export async function GetAreaAndSection(body) {
    const token = Cookies.get('accessToken')
    const id = Cookies.get('id')
  
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/GetAreaAndSection`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }

  



  export async function GetOverAllDispenseCashTickets(body) {
    const token = Cookies.get('accessToken')
    const id = Cookies.get('id')
  
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/OverAllDispenseCashTickets`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }

  export async function GetOverAllDispenseCashTicketsPerName(body) {
    const token = Cookies.get('accessToken')
    const id = Cookies.get('id')
  
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/OverAllDispenseCashTicketsPerName`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }

  export async function GetOverAllDispenseCashTicketsPerCollector(body) {
    const token = Cookies.get('accessToken')
    const id = Cookies.get('id')
  
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/OverAllDispenseCashTicketsPerCollector`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }
  
  