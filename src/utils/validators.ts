// Validation Regex
const PHONE_REGEX = /^(\+373\s?|0\s?)[67]\d\s?\d{3}\s?\d{3}$/
const CITY_REGEX  = /^\p{L}[\p{L}\s.\-']*\p{L}$/u
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_SPECIAL_REGEX = /[!@#$%^&*(),.?"':{}|<>_\-+=\[\]\\/`~;]/

// Optional fields (returns true if empty)
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone || !phone.trim()) return true
  return PHONE_REGEX.test(phone.trim())
}

export function isValidCity(city: string): boolean {
    if(!city ||!city.trim()) return true
    const t = city.trim()
    if(t.length > 50) return false
    if(!CITY_REGEX.test(t)) return false
    const letterCount = t.replace(/[^\p{L}]/gu, '').length
    return letterCount >= 3
}

// Required fields
export function isValidEmail(email: string): boolean {
    if(!email) return false;
  return EMAIL_REGEX.test(email.trim())
}

export function isValidFullName(fullName: string): boolean {
    if(!fullName) return false
  const t = fullName.trim()
  return t.length >= 2 && t.length <= 70
}

export function isStrongPassword(pw: string): boolean {
  if (!pw || pw.length < 8) return false
  const hasUpper = /[A-Z]/.test(pw)
  const hasDigit = /[0-9]/.test(pw)
  const hasSpecial = PASSWORD_SPECIAL_REGEX.test(pw)
  return hasUpper && hasDigit && hasSpecial
}
