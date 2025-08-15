import axios from "axios";
import Cookies from "js-cookie";



export async function GetSupervisor(body) {

  const token = Cookies.get('accessToken')
  const id = Cookies.get('id')
  const response = await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/accountant/supervisor?id=${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })


  return response

}


export async function postSupervisor(body) {

  const token = Cookies.get('accessToken')

  const response = await axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/accountant/supervisor`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })


  return response

}

export async function updateSupervisor(body) {

  const token = Cookies.get('accessToken')

  const response = await axios
    .put(`${process.env.NEXT_PUBLIC_API_URL}/accountant/supervisor/${body.id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })


  return response

}





export async function deleteSupervisor(id) {

  const token = Cookies.get('accessToken')

  const response = await axios
    .delete(`${process.env.NEXT_PUBLIC_API_URL}/accountant/supervisor/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })


  return response

}