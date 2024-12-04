//api//aurinko//callback

import { auth } from "@clerk/nextjs/server"
import { NextResponse,NextRequest} from "next/server";
import { exchsngeCodeForAcessToken, getAccountDetails } from "~/lib/aurinko";
import { db } from "~/server/db";

export const  GET=async(req:NextRequest)=>{
    const {userId}=await auth()
    if(!userId) return NextResponse.json({message:'Failed to link account'},{status:401})

    const params=req.nextUrl.searchParams
    const status=params.get('status')
    if(status!='sucesses')return NextResponse.json({message:'Failed to link account'},{status:401})
    const code =params.get('code')
    if(!code) return NextResponse.json({message:'No Code'},{status:400})
    const token=await exchsngeCodeForAcessToken(code);
    if(!token) return NextResponse.json({message:'No Code to exchange for acess token'},{status:400})
    const accountDetials=await getAccountDetails(token.accessToken);
    await db.account.upsert({
        where:{
            id: token.accountId.toString()
        },
        update:{
            accessToken:token.accessToken,
        },
        create:{
            id:token.accountId.toString(),
            userId,
            emailAddress:accountDetials.email,
            name:accountDetials.name,
            accessToken:token.accessToken,
        }
    })
    return NextResponse.redirect(new URL('/mail',req.url));
    
}