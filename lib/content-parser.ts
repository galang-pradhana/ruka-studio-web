export type SupportedLanguages = 'id' | 'en' | 'ID' | 'EN';

/**
 * Parses a dual-language JSON string from the database and returns the text
 * corresponding to the requested language.
 * 
 * If the value is not a valid JSON (legacy plain string), it will return the string as is.
 * 
 * @param value JSON string e.g. '{"id": "Halo", "en": "Hello"}' or plain string "Halo"
 * @param lang Requested language
 * @param fallback Optional fallback if parsing fails or value is missing
 * @returns 
 */
export function parseDualLanguage(value: string | undefined | null, lang: SupportedLanguages, fallback: string = ""): string {
  if (!value) return fallback;

  try {
    const parsed = JSON.parse(value);
    const normalizedLang = lang.toLowerCase();
    
    if (typeof parsed === 'object' && parsed !== null) {
      if (normalizedLang === 'id' && parsed.id !== undefined) return parsed.id;
      if (normalizedLang === 'en' && parsed.en !== undefined) return parsed.en;
      
      // Fallback to whichever is available if specific lang is missing
      if (parsed.id !== undefined) return parsed.id;
      if (parsed.en !== undefined) return parsed.en;
    }
    
    // If it's a valid JSON but not our expected object, return it as string
    return typeof parsed === 'string' ? parsed : fallback;
  } catch (error) {
    // If JSON.parse fails, it's likely a legacy plain text string
    return value;
  }
}

/**
 * Helper to generate dual language JSON strings to save to DB
 */
export function stringifyDualLanguage(idValue: string, enValue: string): string {
  return JSON.stringify({ id: idValue, en: enValue });
}
