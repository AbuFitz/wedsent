"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { call } from "@/lib/api-client";
import "./nav-reimagined.css";

export function Nav({studioHref="/studio"}:{studioHref?:string}){
  const [session,setSession]=useState<"loading"|"guest"|"owner">("loading");
  const [menu,setMenu]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  const pathname=usePathname();
  useEffect(()=>{let active=true;void call<{user:{id:string}|null}>("GET","/api/me").then(v=>{if(active)setSession(v.user?"owner":"guest")}).catch(()=>{if(active)setSession("guest")});return()=>{active=false}},[]);
  useEffect(()=>{const onScroll=()=>setScrolled(window.scrollY>Math.max(320,window.innerHeight*.7));onScroll();window.addEventListener("scroll",onScroll,{passive:true});return()=>window.removeEventListener("scroll",onScroll)},[]);
  useEffect(()=>{setMenu(false)},[pathname]);
  useEffect(()=>{if(!menu)return;const old=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=old}},[menu]);
  const createHref=session==="owner"?studioHref:"/start";
  return <><header className={`sn ${scrolled?"sn-scrolled":""} ${menu?"sn-open":""}`}>
    <button className="sn-menu-button" aria-label={menu?"Close menu":"Open menu"} aria-expanded={menu} onClick={()=>setMenu(v=>!v)} type="button">{menu?<X size={27}/>:<span className="sn-lines"><i/><i/></span>}</button>
    <Link href="/" className="sn-brand">weddsent<span className="sn-brand-mark">✳</span></Link>
    <Link href={createHref} className="sn-action"><span>{session==="owner"?"OPEN STUDIO":"CREATE INVITE"}</span><b><ArrowUpRight size={23}/></b></Link>
  </header>
  <AnimatePresence>{menu&&<motion.div className="sn-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.24}}>
    <nav aria-label="Expanded navigation">
      {[["01","HOME","/"],["02","DESIGNS","/designs"],["03","PRICING","/pricing"],["04",session==="owner"?"MY WEDDING":"SIGN IN",session==="owner"?"/dashboard":"/signin?mode=in"],["05","CREATE","/start"]].map(([num,name,href])=><Link key={num} href={href} onClick={()=>setMenu(false)}><small>{num}</small><span>{name}</span><ArrowUpRight size={34}/></Link>)}
    </nav>
    <div className="sn-overlay-bottom"><span>DIGITAL WEDDING INVITATIONS</span><span>YOUR MOMENT STARTS HERE.</span></div>
  </motion.div>}</AnimatePresence></>;
}
