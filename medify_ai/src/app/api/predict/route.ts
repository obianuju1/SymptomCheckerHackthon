import type { NextApiRequest,NextApiResponse } from "next";
import { useAuth } from "../../../../context/AuthContext";
import Axios from "axios"

interface ResponseData {
    symptoms: string[],
    userID: string,
    disease: string,
    precautions: string[],
    description: string,
    time_created: string 
    
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const {id,symptoms} = req.body
    axios.post()


}