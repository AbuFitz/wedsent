export type DesignId = "sway" | "noor" | "afterglow";
export type InviteData = {names:string; date:string; venue:string; city:string; message:string; ceremony:string; accent:string; music:boolean; design:DesignId};
export const defaults:InviteData = {names:"Amina & Yusuf",date:"2027-06-12",venue:"The Glasshouse",city:"London, England",message:"A little love, a lot of joy. Come celebrate with us.",ceremony:"The celebration",accent:"",music:false,design:"sway"};
export const designs:{id:DesignId;name:string;eyebrow:string;description:string;palette:string;image:string}[] = [
 {id:"sway",name:"Sway",eyebrow:"01 / THE EDITORIAL",description:"A love letter with a little attitude. Bold type, brilliant simplicity.",palette:"Paper · Ink · Coral",image:""},
 {id:"noor",name:"Noor",eyebrow:"02 / THE CEREMONIAL",description:"A quietly dramatic arch, rich colour, and considered detail.",palette:"Forest · Brass",image:""},
 {id:"afterglow",name:"Afterglow",eyebrow:"03 / THE EXPRESSIVE",description:"An unexpected pop of colour. Big romance, modern energy.",palette:"Lilac · Coral",image:""}
];
export function friendlyDate(value:string){const d=new Date(`${value}T12:00:00`);return Number.isNaN(d.getTime())?"Date to be announced":new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"long",year:"numeric"}).format(d)}
