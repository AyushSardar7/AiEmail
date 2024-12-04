'use client'

import React from 'react'
import { Button } from './button'
import { getAuroinkoAuthUrl } from '~/lib/aurinko'


const LinkAccountButton = () => {
  return (
    <div>
      <Button onClick={async()=>{
        const authUrl=await getAuroinkoAuthUrl('Google')
        window.location.href=authUrl;
        console.log(authUrl);
      }}>
        Link Account
      </Button>
    </div>
  )
}

export default LinkAccountButton
