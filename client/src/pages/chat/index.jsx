import { useAppStore } from "@/store"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { toast } from "sonner";
import ChatContainer from "./componenets/chat-container";
import ContactContainer from "./componenets/contact-container";
import EmptyChatContainer from "./componenets/empty-chat-container";


export default function Chat(){
    const {userInfo} = useAppStore();
     const navigate = useNavigate();
     useEffect(()=>{
       if(!userInfo.profileSetUp){
          toast("please setup profile to continue");
          navigate("/profile")
       }
     },[userInfo,navigate])
    return(
        <div className="flex h-[100vh] text-white overflow-hidden">
            <ContactContainer/>  
            <EmptyChatContainer/>          
            <ChatContainer/>
        </div>
    )
}