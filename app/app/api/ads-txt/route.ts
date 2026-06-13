export function GET() {
  return new Response('google.com, pub-5240608264303390, DIRECT, f08c47fec0942fa0\n', {
    headers: { 'Content-Type': 'text/plain' },
  })
}
