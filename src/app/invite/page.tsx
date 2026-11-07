"use client";
import {useEffect,useState} from "react";
import {Invitation} from "@/components/invitation";
import {defaults,InviteData} from "@/lib/designs";
export default function InvitePage(){const [data,setData]=useState<InviteData>(defaults);useEffect(()=>{try{const raw=localStorage.getItem("wedsent-preview-draft-v1");if(raw)setData({...defaults,...JSON.parse(raw)})}catch{}},[]);return <main className="invite-public"><Invitation data={data}/></main>}
