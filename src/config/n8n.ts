export const N8N_CONFIG = {
  WEBHOOK_URL: 'http://localhost:5678/webhook-test/scrum-agents',
    HEADERS: {
    'Content-Type': 'application/json',
  },
    TIMEOUT: 30000,
}

export const sendToN8nWebhook = async (data: any) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), N8N_CONFIG.TIMEOUT)

  try {
    const response = await fetch(N8N_CONFIG.WEBHOOK_URL, {
      method: 'POST',
      headers: N8N_CONFIG.HEADERS,
      body: JSON.stringify(data),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}
