import axios from "axios"
import Cookies from "js-cookie"

export async function getBetsById(id) {
    const token = Cookies.get('accessToken')
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/void/${id}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }



  export async function putBet(body) {
 
    const token = Cookies.get('accessToken')
  console.log(body,' asdad');
    const response =  await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/admin/void/${body.transactionId}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }
