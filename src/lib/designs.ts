export type DesignId = "sway" | "noor" | "afterglow";
export type InviteData = {names:string; date:string; venue:string; city:string; message:string; ceremony:string; accent:string; music:boolean; design:DesignId};
export const defaults:InviteData = {names:"Amina & Yusuf",date:"2027-06-12",venue:"The Glasshouse",city:"London, England",message:"A little love, a lot of joy. Come celebrate with us.",ceremony:"The celebration",accent:"",music:false,design:"sway"};
export const designs:{id:DesignId;name:string;eyebrow:string;description:string;palette:string;image:string}[] = [
 {id:"sway",name:"Sway",eyebrow:"01 / THE EDITORIAL",description:"A fashion-forward love letter. Monumental type, quiet confidence.",palette:"Ink · Ivory",image:"https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85"},
 {id:"noor",name:"Noor",eyebrow:"02 / THE HERITAGE",description:"Ornamental, warm and wonderfully ceremonial.",palette:"Bronze · Sand",image:"https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=85"},
 {id:"afterglow",name:"Afterglow",eyebrow:"03 / THE ROMANTIC",description:"Soft-focus celebration with a little cinematic drama.",palette:"Rose · Wine",image:"https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1200&q=85"}
];
export function friendlyDate(value:string){const d=new Date(`${value}T12:00:00`);return Number.isNaN(d.getTime())?"Date to be announced":new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"long",year:"numeric"}).format(d)}
