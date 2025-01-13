import type { NextApiRequest,NextApiResponse } from "next";


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


}