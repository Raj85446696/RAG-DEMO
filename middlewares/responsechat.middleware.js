import { chat } from "../src/chat.js";
export const responseChat = async(req,res)=>{
      try {
        const answer = await chat(req.body.question);
        res.json({ answer });
      } catch (err) {
        res.json(err);
        console.log(err);
      }
}