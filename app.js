import { LilyPondWasmRenderer } from "./lilypond-renderer.js";

const source=document.querySelector("#source"), openFile=document.querySelector("#openFile"),
saveSource=document.querySelector("#saveSource"), renderButton=document.querySelector("#render"),
score=document.querySelector("#score"), status=document.querySelector("#status"), player=document.querySelector("#player");
const renderer=new LilyPondWasmRenderer();
let midiURL=null;

openFile.addEventListener("change",async()=>{const f=openFile.files?.[0];if(f){source.value=await f.text();status.textContent=`Geladen: ${f.name}`;}});
saveSource.addEventListener("click",()=>{const u=URL.createObjectURL(new Blob([source.value],{type:"text/plain;charset=utf-8"}));const a=document.createElement("a");a.href=u;a.download="score.ly";a.click();URL.revokeObjectURL(u);});
renderButton.addEventListener("click",async()=>{
 renderButton.disabled=true; status.textContent="LilyPond wird gestartet/gerendert …";
 try{
  const r=await renderer.render(source.value); score.innerHTML=r.svg;
  if(midiURL)URL.revokeObjectURL(midiURL);
  if(r.midiBlob){midiURL=URL.createObjectURL(r.midiBlob);player.src=midiURL;player.hidden=false;}
  status.textContent=r.diagnostics;
 }catch(e){status.textContent=e?.message||String(e);}
 finally{renderButton.disabled=false;}
});