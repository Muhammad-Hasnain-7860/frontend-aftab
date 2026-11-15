import { axiosInstance } from "../../../app/api/axiosInstance"

export const lectureCreateApi = async(data)=>{
    try {
        const response = await axiosInstance.post('/lecture/create' , data)
        console.log(response)
    } catch (error) {
       return Promise.reject(error)
    }
}
