# LilyPond Tools

## Version 0.2.0 – erster Rendering-Teststand

Kleine eigenständige WebApp für LilyPond. Keine LilyPond-Funktionalität wird in Minimal Composer eingebaut.

### V0.2
- .ly öffnen und speichern
- echtes GNU LilyPond 2.27.1 via WebAssembly/Web Worker
- SVG-Partitur im Browser
- vom Renderer erzeugtes MIDI an den Browser-Player
- kein externer Rendering-Server

Basis: `@jocelyn-stericker/lilypond-wasm` aus Hacklily (GPL-3.0-or-later). Der Renderer ist echtes LilyPond + Guile in WebAssembly, keine eigene Notensatzimplementierung.

### Architektur
LilyPond Tools ist ausschließlich eine technische Darstellungsschicht **nach** der freien Komposition. Es macht keinerlei Formatvorgabe an die komponierende KI. Composition Engine 2.12.0 und Minimal Composer bleiben unverändert.

### Lokal
`npm install`
`npm run dev`

### Build
`npm run build`

Der Build kopiert die vier LilyPond-WASM-Laufzeitdateien nach `dist/wasm`, sodass die erzeugte WebApp statisch gehostet werden kann.

### Noch zu prüfen
V0.2 ist bewusst ein Teststand. Vor der Anbindung an Minimal Composer muss eine echte Gemini-LilyPond-Komposition erfolgreich als SVG gerendert und als MIDI abgespielt werden.
