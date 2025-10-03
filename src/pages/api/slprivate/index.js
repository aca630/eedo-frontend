import axios from "axios";
import Cookies from "js-cookie";


//ITO ANG KUKUHA NG DATA SA DATABASE TABLE NA LIVESTOCK
//TINAWAG ANG GETLIVESTOCK SA PAGE NA INDEX.JS SA FOLDER NA LIVE_STOCK AT PAGE NA pages
export async function GetSLPrivate(body) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/slprivate`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }


  //ITO ANG MAGPOPOST NG DATA SA DATABASE TABLE NA LIVESTOCK PARANG INSERT NG PROCESS
export async function postSLPrivate(body) 
{
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/admin/slprivate`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }

export async function putSLPrivate(body) {
  const token = Cookies.get("accessToken");

  return await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/slprivate/${body?.id}`, body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function deleteSLPrivate(id) {
  const token = Cookies.get("accessToken");

  return await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/slprivate/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}