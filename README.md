# LilyPond Tools

Schlanke Begleit-WebApp für LilyPond-Dateien aus Composition Engine / Minimal Composer.

## Version 0.1.0

V0.1 legt bewusst nur die unabhängige Oberfläche und die Renderer-Schnittstelle fest. Die App enthält **keine eigene Notensatz-Implementierung**.

Ziel:
- LilyPond-Quelltext öffnen/einfügen/bearbeiten
- .ly speichern
- Renderer austauschbar anbinden
- gerenderte SVG-Partitur anzeigen
- MIDI aus dem Renderer abspielen/speichern
- später Deep-Link Minimal Composer ↔ LilyPond Tools

## Architekturregel

Die App ist ein technisches Werkzeug **nach** der Komposition. Sie macht keinerlei Vorgaben an die komponierende KI. Die Composition Engine und Minimal Composer werden für V0.1 nicht verändert.

## Renderer

Die Recherche am 27.09.2026 ergab:
- Spontini: leistungsfähig, aber Python-Server und für unser Ziel zu groß.
- Hacklily: sehr passende Web-Oberfläche; Rendering erfolgt über einen separaten Renderer-Dienst.
- lilypond-mcp/lilypond-wasi: echtes LilyPond als WASM/WASI, derzeit im geprüften Projekt über Node/WASI ausgeführt, nicht einfach als statische Browserbibliothek einsetzbar.

Deshalb besitzt V0.1 eine kleine `RendererAdapter`-Grenze. Erst nach einem realen Rendering-Test wird entschieden, ob ein browserlokaler WASI-Adapter oder ein kleiner externer Renderer verwendet wird. So vermeiden wir eine falsche technische Festlegung.

## Dateien

- `index.html` – kleine Benutzeroberfläche
- `app.js` – Datei-/Editor-/Renderer-Logik
- `style.css` – Darstellung

## Nächster Test

Eine echte von Gemini erzeugte LilyPond-Komposition soll unverändert durch den Renderer laufen. Erst wenn SVG + MIDI zuverlässig erzeugt werden, wird der Renderer als Standard festgelegt.
