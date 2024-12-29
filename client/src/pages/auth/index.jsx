//index.jsx page of auth 
import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { useState } from "react"
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client.js";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constant";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
export default function Auth(){
   const navigate = useNavigate();
   const {setUserInfo} = useAppStore()
    const [email,setEmail] =useState("");
    const [password,setPassword] =useState("");
    const [confirmPassword,setConfirmPassword] =useState("");
    const validateSignup=()=>{
         if(!email.length){
            toast.error("Email is required")
            return false
         }else if(!password.length){
            toast.error("password is required")
            return false
         }
         else if(password !== confirmPassword){
            toast.error("password & confirm password should be same")
            return false
         }
            return true;
         
         
    }
    const validateLogin=()=>{
      if(!email.length){
         toast.error("Email is required")
         return false
      }else if(!password.length){
         toast.error("password is required")
         return false
      }
      return true
    }
    const handleLogin = async()=>{
       if(validateLogin()){
         const response = await apiClient.post(LOGIN_ROUTE,{email,password},{withCredentials:true})
         if(response.data.user.id){
             setUserInfo(response.data.user)
             if(response.data.user.profileSetUp){
                 navigate("/chat")
             }else{
               navigate("/profile")
             }

         }
         console.log(response)
         toast.success("Login successful!");
       }
    }
    const handleSignup = async()=>{
         if(validateSignup()){
           const response = await apiClient.post(SIGNUP_ROUTE,{email,password},{withCredentials:true});
           if(response.status===201){
              setUserInfo(response.data.user)
              navigate("/profile")
           }
           console.log(response)
           toast.success("Signup successful!");
         }
    }
    return(
        <div className="h-screen flex items-center justify-center">
            <div className="min-h-screen bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
               <div className="flex flex-col gap-10 items-center justify-center">
                   <div className="flex items-center justify-center flex-col">
                      <div className="flex items-center justify-center">
                         <h1 className="text-5xl font-bold md:text-6xl">
                            Welcome
                         </h1>
                         <img src={Victory} alt="victory emoji" className="h-[100px]" />
                          
                      </div>
                      <p className="font-medium text-center">
                            fill in the details to get started with the best chat app 
                      </p> 
                   </div>
                   <div className="flex items-center justify-center w-full">
                       <Tabs className="w-3/4" defaultValue="login">
                          <TabsList className="bg-transparent rounded-none w-full flex justify-between">
                             <TabsTrigger  value="login" 
                               className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full
                                data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500
                                p-3 transition-all duration-300"
                             >
                                Login
                             </TabsTrigger>
                             <TabsTrigger value="signup"  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full
                                data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500
                                p-3 transition-all duration-300">
                                Signup
                             </TabsTrigger>
                          </TabsList>
                           <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                              <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={e=>setEmail(e.target.value)}/>
                              <Input placeholder="Password" type="password" className="rounded-full p-6" value={password} onChange={e=>setPassword(e.target.value)}/>
                               <Button className="rounded-full p-6 " onClick={handleLogin}>Login</Button>
                           </TabsContent>
                           <TabsContent className="flex flex-col gap-4 " value="signup">
                               <Input placeholder="Email" type="email" className="rounded-full p-5" value={email} onChange={e=>setEmail(e.target.value)}/>
                              <Input placeholder="Password" type="password" className="rounded-full p-5" value={password} onChange={e=>setPassword(e.target.value)}/>
                              <Input placeholder="Confirm Password" type="password" className="rounded-full p-4" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}/>
                              <Button className="rounded-full p-6 " onClick={handleSignup}>Signup</Button>


                           </TabsContent>
                       </Tabs>
                   </div>
               </div>
               <div className="hidden xl:flex justify-center items-center h-full w-full">
                    <img src={Background} alt="Background login" className="h-full w-full object-cover"/>
               </div>
            </div>
        </div>
       
    )
}