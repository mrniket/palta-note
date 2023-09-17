Bun.serve({
  fetch(req) {
    return new Response(Bun.file(import.meta.dir + '/index.html'))
  },
})
