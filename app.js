import { LilyPondWasmRenderer } from "./lilypond-renderer.js";
import { MidiSoundFontPlayer } from "./midi-player.js";

const source=document.querySelector("#source"), openFile=document.querySelector("#openFile"),
saveSource=document.querySelector("#saveSource"), renderButton=document.querySelector("#render"),
score=document.querySelector("#score"), status=document.querySelector("#status"), playerBox=document.querySelector("#midiPlayer");
const renderer=new LilyPondWasmRenderer();
const midiPlayer=new MidiSoundFontPlayer({play:document.querySelector("#play"),stop:document.querySelector("#stop"),seek:document.querySelector("#seek"),time:document.querySelector("#time"),state:status});

openFile.addEventListener("change",async()=>{const f=openFile.files?.[0];if(f){source.value=await f.text();status.textContent=`Geladen: ${f.name}`;}});
saveSource.addEventListener("click",()=>{const u=URL.createObjectURL(new Blob([source.value],{type:"text/plain;charset=utf-8"}));const a=document.createElement("a");a.href=u;a.download="score.ly";a.click();URL.revokeObjectURL(u);});
renderButton.addEventListener("click",async()=>{
 renderButton.disabled=true; status.textContent="LilyPond wird gestartet/gerendert …";
 try{
  const r=await renderer.render(source.value); score.innerHTML=r.svg;
  if(r.midiBlob){midiPlayer.load(await r.midiBlob.arrayBuffer());playerBox.hidden=false;}
  else{playerBox.hidden=true;}
  status.textContent=r.diagnostics+(r.midiBlob?" · MIDI bereit":" · kein MIDI erzeugt");
 }catch(e){status.textContent=e?.message||String(e);}
 finally{renderButton.disabled=false;}
});