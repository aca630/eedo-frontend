import axios from "axios";
import Cookies from "js-cookie";



export async function GetCashTicketsTransactions(body) {
  const token = Cookies.get('accessToken')
  const id = Cookies.get('id')

  const response =  await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/collector/CashTicketsTransactions?id=${body?.id}&from=${body?.from}&to=${body?.to}`,{
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })


    return response
  
}

  export async function putDispenseCashTicket(body) {

 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/collector/dispense_cash_ticket/${body?.id}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }