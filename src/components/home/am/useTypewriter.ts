import { useEffect, useRef, useState } from 'react'

interface TypewriterOptions {
  typeMs?: number
  holdMs?: number
  eraseMs?: number
  betweenMs?: number
}

export function useTypewriter(
  words: string[],
  { typeMs = 90, holdMs = 1400, eraseMs = 50, betweenMs = 200 }: TypewriterOptions = {},
) {
  const [text, setText] = useState('')
  const [idx, setIdx] = useState(0)
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true
  }, [])

  useEffect(() => {
    if (reducedMotion.current) {
      setText(words[idx])
      return
    }

    let timer: ReturnType<typeof setTimeout>
    const word = words[idx]
    let i = 0

    const erase = () => {
      i -= 1
      setText(word.slice(0, i))
      if (i > 0) {
        timer = setTimeout(erase, eraseMs)
      } else {
        timer = setTimeout(() => setIdx((p) => (p + 1) % words.length), betweenMs)
      }
    }

    const type = () => {
      i += 1
      setText(word.slice(0, i))
      if (i < word.length) {
        timer = setTimeout(type, typeMs)
      } else {
        timer = setTimeout(erase, holdMs)
      }
    }

    timer = setTimeout(type, typeMs)
    return () => clearTimeout(timer)
  }, [idx, words, typeMs, holdMs, eraseMs, betweenMs])

  return text || ' '
}
