const source = document.querySelector("#source");
const openFile = document.querySelector("#openFile");
const saveSource = document.querySelector("#saveSource");
const renderButton = document.querySelector("#render");
const score = document.querySelector("#score");
const status = document.querySelector("#status");
const player = document.querySelector("#player");

/**
 * Stable boundary between this small UI and a LilyPond renderer.
 * A renderer returns { svg, midiBlob?, pdfBlob?, diagnostics? }.
 * V0.1 intentionally does not pretend that a renderer is connected.
 */
class RendererAdapter {
  async render(_lilypondSource) {
    throw new Error("Noch kein LilyPond-Renderer verbunden.");
  }
}

let renderer = new RendererAdapter();

openFile.addEventListener("change", async () => {
  const file = openFile.files?.[0];
  if (!file) return;
  source.value = await file.text();
  status.textContent = `Geladen: ${file.name}`;
});

saveSource.addEventListener("click", () => {
  const blob = new Blob([source.value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "score.ly";
  a.click();
  URL.revokeObjectURL(url);
});

renderButton.addEventListener("click", async () => {
  renderButton.disabled = true;
  status.textContent = "Renderer wird aufgerufen …";
  try {
    const result = await renderer.render(source.value);
    if (!result?.svg) throw new Error("Renderer lieferte kein SVG.");
    score.innerHTML = result.svg;
    if (result.midiBlob) {
      player.src = URL.createObjectURL(result.midiBlob);
      player.hidden = false;
    }
    status.textContent = result.diagnostics || "Partitur erzeugt.";
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : String(error);
  } finally {
    renderButton.disabled = false;
  }
});

export function setRendererAdapter(adapter) {
  renderer = adapter;
}
