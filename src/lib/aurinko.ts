"use server"
import axios from 'axios'
import { auth } from "@clerk/nextjs/server"
import { headers } from 'next/headers'

export const getAuroinkoAuthUrl = async (serviceType: 'Google' | 'Office365') => {
    const { userId } = await auth()
    if (!userId) throw new Error("Unathorized")

    const params = new URLSearchParams({
        clientId: process.env.AURINKO_CLIENT_ID as string,
        serviceType,
        scopes: 'Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All',
        responseType: 'code',
        returnUrl: `${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`
    })

    return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`
}

export const exchsngeCodeForAcessToken = async (code: string) => {
    try {
        const response = await axios.post(`http://api.aurinko/v1/auth/token/${code}`, {}, {
            auth: {
                username: process.env.AURINKO_CLIENT_ID as string,
                password: process.env.AURINKO_CLIENT_SECRET as string,
            }
        })
        return response.data as {
            accountId: number,
            accessToken: string,
            userId: string,
            userSession: string
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.response?.data);
        }
    }
}

export const getAccountDetails = async (accessToken: string) => {
    try {
        const response = await axios.get('http://api.aurinko.io/v1/account', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        return response.data as{
            email:string,
            name:string
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('Error fetching account details',error.response?.data);
        }else{
            console.error('Unnexpexted error fetching account details',error);
        }
        throw error;
    }
}