// build source files
const build = await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  naming: "[dir]/[name]-[hash].[ext]",
})

// console.log(build)
const entryHash = build.outputs.find(i => i.kind == 'entry-point')?.hash

// copy html
const inputHtml = Bun.file("index.html");
const outputHtml = Bun.file("dist/index.html");
let content = await inputHtml.text();
content = content.replace('src/index.ts', `index-${entryHash}.js`)
await Bun.write(outputHtml, content);

// dev server
// serve static file
Bun.serve({
  async fetch(req) {
    const path = new URL(req.url).pathname;
    const file = Bun.file(path == '/' ? "dist/index.html" : "dist" + path);
    return new Response(file);
  }
})
