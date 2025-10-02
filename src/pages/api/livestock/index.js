import axios from "axios";
import Cookies from "js-cookie";


//ITO ANG KUKUHA NG DATA SA DATABASE TABLE NA LIVESTOCK
//TINAWAG ANG GETLIVESTOCK SA PAGE NA INDEX.JS SA FOLDER NA LIVE_STOCK AT PAGE NA pages
export async function GetLivestock(body) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/livestockcharges`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }


  //ITO ANG MAGPOPOST NG DATA SA DATABASE TABLE NA LIVESTOCK PARANG INSERT NG PROCESS
export async function postLivestock(body) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/admin/livestockcharges`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }



  
export async function deleteLivestock(id) {
 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/livestockcharges/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }

  export async function putLivestock(body) {

 
    const token = Cookies.get('accessToken')
  
    const response =  await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/admin/livestockcharges/${body?.id}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })


      return response
    
  }