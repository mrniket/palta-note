Bun.serve({
  port: 4000,
  fetch(req) {
    const indexFile = Bun.file('./dist/index.js')
    return new Response(indexFile, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
  },
  error() {
    return new Response(null, { status: 404 })
  },
})
