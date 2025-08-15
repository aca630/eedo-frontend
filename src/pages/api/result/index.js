import axios from "axios";
import Cookies from "js-cookie";



export async function CreateDraw(body) {
  const token = Cookies.get('accessToken')

  const response =  await axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/admin/draw`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })


    return response
  
}





export async function GetResult(body) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/draw?from=${body?.from}&to=${body.to}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }


  export async function putResult(body) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/admin/draw/${body.id}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }


  export async function ApiCloseBet(body) {

 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/admin/closeBet/${body?.id}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }



  
export async function TellerOfflineGrossPerDraw(body) {
 
  const token = Cookies.get('accessToken')

  const response =  await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/TellerOfflineGrossPerDraw?drawId=${body?.drawId}`,{
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })


    return response
  
}

