import { db } from "./server/db";

await db.user.create({
    data:{
        emailAdress:'ayush@gmail.com',
        firstName:'Ayush',
        lastName:'Sardar'
    }
})
console.log('done');