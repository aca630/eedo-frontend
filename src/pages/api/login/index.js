import axios from "axios";

export async function login(body) {
    const data = {
      email: body.username,
      password: body.password,
    };
  
    const response =  await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/admin/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })


      return response
    
  }