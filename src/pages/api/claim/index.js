import axios from "axios"
import Cookies from "js-cookie"

export async function getClaimById(id) {
    const token = Cookies.get('accessToken')
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/accountant/claim/${id}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }



  export async function ClaimBet(body) {
 
    const token = Cookies.get('accessToken')
  console.log(body,' asdad');
    const response =  await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/accountant/claim/${body.transactionId}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }
