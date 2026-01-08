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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/OverAllDispenseCashTickets?from=${body?.from}&to=${body?.to}`,{
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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/OverAllDispenseCashTicketsPerName?from=${body?.from}&to=${body?.to}`,{
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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/OverAllDispenseCashTicketsPerCollector?from=${body?.from}&to=${body?.to}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }


  export async function GetOverAllMonthlyPayment(body) {
    const token = Cookies.get('accessToken')
    const id = Cookies.get('id')
  
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/OverAllMonthlyPayment?from=${body?.from}&to=${body?.to}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }


  export async function GetOverAllMonthlyPaymentPerArea(body) {
    const token = Cookies.get('accessToken')
    const id = Cookies.get('id')
  
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/OverAllMonthlyPaymentPerArea?from=${body?.from}&to=${body?.to}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }

  export async function GetOverAllMonthlyPaymentPerCollector(body) {
    const token = Cookies.get('accessToken')
    const id = Cookies.get('id')
  
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/OverAllMonthlyPaymentPerCollector?from=${body?.from}&to=${body?.to}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }

  export async function GetOverAllDispenseTerminalTickets(body) {
    const token = Cookies.get('accessToken')
    const id = Cookies.get('id')
  
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/terminal/OverAllDispenseTerminalTickets?from=${body?.from}&to=${body?.to}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }



  export async function GetMonthlyRentalReports(body) {
    const token = Cookies.get('accessToken')
    const id = Cookies.get('id')
  
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/MontlyRentalReports?from=${body?.from}&to=${body?.to}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }

  export async function GetMonthlyRentalReportsChecker(body) {
    const token = Cookies.get('accessToken')
    const id = Cookies.get('id')
  
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/MontlyRentalReportsChecker?from=${body?.from}&to=${body?.to}&stall_no=${body?.stall_no}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }
  

  
  