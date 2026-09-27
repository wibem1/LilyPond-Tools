export class LilyPondWasmRenderer {
  constructor(workerURL = "./wasm/lily-worker.js") {
    this.workerURL = workerURL;
    this.worker = null;
    this.ready = false;
    this.queue = [];
    this.nextId = 1;
    this.spawn();
  }
  spawn() {
    this.worker = new Worker(this.workerURL);
    this.worker.onmessage = (e) => {
      const m = e.data;
      if (m?.type === "ready") {
        this.ready = true;
        for (const wake of this.queue.splice(0)) wake();
      }
      if (m?.type === "result") {
        const job = this.pending?.get(m.id);
        if (!job) return;
        this.pending.delete(m.id);
        if (!m.ok || !m.pages?.length) return job.reject(new Error(m.status || (m.logs || []).join("\n") || "LilyPond-Rendering fehlgeschlagen"));
        const midiBlob = m.midi?.length ? new Blob([m.midi], {type:"audio/midi"}) : null;
        job.resolve({svg:m.pages.join("\n"), midiBlob, diagnostics:`LilyPond: ${m.pages.length} Seite(n), ${m.ms ?? "?"} ms`});
      }
    };
    this.worker.onerror = e => console.error("LilyPond worker", e);
    this.pending = new Map();
  }
  async waitReady() {
    if (this.ready) return;
    await new Promise(resolve => this.queue.push(resolve));
  }
  async render(src) {
    await this.waitReady();
    const id = this.nextId++;
    return new Promise((resolve,reject)=>{
      this.pending.set(id,{resolve,reject});
      this.worker.postMessage({type:"render",id,src});
    });
  }
}