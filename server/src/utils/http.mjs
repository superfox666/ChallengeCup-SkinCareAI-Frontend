export function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,x-api-key",
  })
  response.end(JSON.stringify(body))
}

export async function readJsonBody(request) {
  const chunks = []

  for await (const chunk of request) {
    chunks.push(chunk)
  }

  if (chunks.length === 0) {
    return {}
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"))
}

export async function requestJson(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })

    const text = await response.text()
    const data = text ? JSON.parse(text) : {}

    return {
      ok: response.ok,
      status: response.status,
      data,
    }
  } finally {
    clearTimeout(timer)
  }
}

export function sendSseHeaders(response) {
  response.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  })
}

export function writeSseEvent(response, event, payload) {
  response.write(`event: ${event}\n`)
  response.write(`data: ${JSON.stringify(payload)}\n\n`)
}
