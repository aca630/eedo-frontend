import axios from "axios";
import Cookies from "js-cookie";



export async function GetTallyPerDraw(body) {
 
    const token = Cookies.get('accessToken')
    const id = Cookies.get('id')
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/accountant/AccountantTallySheetPerDraw?id=${id}&from=${body.from}&to=${body.to}&drawId=${body.drawId}&isOffline=${body?.isOffline}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }