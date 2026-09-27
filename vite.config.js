import { defineConfig } from "vite";
import fs from "node:fs";
import path from "node:path";

const wasmDir = path.resolve("node_modules/@jocelyn-stericker/lilypond-wasm");

export default defineConfig({
  base: "./",
  plugins: [{
    name: "lilypond-wasm-assets",
    configureServer(server) {
      server.middlewares.use("/wasm", (req, res, next) => {
        const file = path.join(wasmDir, req.url.replace(/^\//, ""));
        if (!file.startsWith(wasmDir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return next();
        res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
        fs.createReadStream(file).pipe(res);
      });
    },
    closeBundle() {
      const out = path.resolve("dist/wasm");
      fs.mkdirSync(out, { recursive: true });
      for (const name of ["lily-worker.js","lilypond-web.js","lilypond.wasm","lilypond.data"]) {
        const src = path.join(wasmDir, name);
        if (fs.existsSync(src)) fs.copyFileSync(src, path.join(out, name));
      }
    }
  }]
});