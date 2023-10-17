export function isMobile(mobile: string) {
  return /^1[3-9]\d{9}$/.test(mobile)
}
