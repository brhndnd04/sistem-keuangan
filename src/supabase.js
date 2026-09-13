import { createClient } from '@supabase/supabase-js'
const url = 'https://dyybidqvvwuzbdzwipiv.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5eWJpZHF2dnd1emJkendpcGl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMTI1NTAsImV4cCI6MjEwNDg4ODU1MH0.LzZU2VJgyYOQsZQU1eNMpXqeAnloihOJ0zWc4g8Blpc'
export const supabase = createClient(url, key)
export async function loadData() {
  const { data } = await supabase.from('app_data').select('data').eq('id', 'main').single()
  return data?.data || null
}
export async function saveData(appData) {
  await supabase.from('app_data').upsert({ id: 'main', data: appData, updated_at: new Date().toISOString() })
}