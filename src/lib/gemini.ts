export interface AssistantHistoryItem {
  sender: 'ai' | 'user';
  text: string;
}

// Client proxy calling server-side /api/assistant (no API keys in browser bundle)
export async function askPondokAssistant(
  prompt: string,
  contextMode: 'landing_public' | 'erp_internal' = 'landing_public',
  moduleContext?: string,
  userRole?: string,
  history: AssistantHistoryItem[] = []
): Promise<string> {
  const res = await fetch('/api/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      contextMode,
      moduleContext,
      userRole,
      history,
    }),
  });

  const rawText = await res.text().catch(() => '');
  let payload: { text?: string; error?: string } = {};
  if (rawText.trim().startsWith('{')) {
    try {
      payload = JSON.parse(rawText) as { text?: string; error?: string };
    } catch {
      payload = {};
    }
  }

  if (!res.ok) {
    if (payload?.error) {
      throw new Error(payload.error);
    }
    if (res.status === 403) {
      throw new Error(
        'Akses Asisten AI ditolak (403). Mohon periksa atau pilih GEMINI_API_KEY dan pastikan billing aktif pada panel Settings > Secrets.'
      );
    }
    if (res.status === 503) {
      throw new Error(
        'GEMINI_API_KEY belum tersedia pada server. Silakan atur kunci API pada panel Settings > Secrets.'
      );
    }
    throw new Error(`Layanan Asisten AI gagal merespons (${res.status}).`);
  }

  if (!payload.text?.trim()) {
    throw new Error('Asisten AI tidak memberikan respons. Silakan coba kembali.');
  }

  return payload.text.trim();
}
