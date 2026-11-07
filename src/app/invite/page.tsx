"use client";
import {useEffect,useState} from "react";
import {InviteExperience} from "@/components/invite-experience";
import {defaults,InviteData} from "@/lib/designs";
export default function InvitePage(){const [data,setData]=useState<InviteData>(defaults);useEffect(()=>{try{const raw=localStorage.getItem("wedsent-preview-draft-v1");if(raw)setData({...defaults,...JSON.parse(raw)})}catch{}},[]);return <main className="w7-public"><div className="w7-public-frame"><InviteExperience data={data}/></div><p>WEDSENT / EARLY GUEST PREVIEW</p></main>}
