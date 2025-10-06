import type { SupabaseClient } from "@supabase/supabase-js"
// import { supabase } from "./supabase"

export async function uploadBase64(supabase: SupabaseClient, base64String: string, filePath: string) {
  // Hilangkan prefix "data:image/png;base64,"
  const base64Data = base64String.split(',')[1]

  // Ubah base64 ke array buffer
  const byteCharacters = atob(base64Data)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)

  // Buat Blob (anggap ini gambar PNG)
  const blob = new Blob([byteArray], { type: 'image/png' })

  // Upload ke Supabase storage
  const { data, error } = await supabase.storage
    .from('absendulu')
    .upload(filePath, blob, {
      contentType: 'image/png',
      upsert: true,
    })

  if (error) throw error
  return data
}


export async function uploadFormData(supabase: SupabaseClient, file: File | null) {
  if (!file) {
    throw new Error("File tidak ditemukan di FormData");
  }

  const fileName = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from('absendulu')
    .upload('requests/' + fileName, file, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    throw error;
  }

  return data;
}