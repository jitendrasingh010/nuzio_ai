import api from '../lib/axios'

export const usersignup=async(userdata)=>{
const response =await api.post('/userapi/signup',userdata)
return response.data
}