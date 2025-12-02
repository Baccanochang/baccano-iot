import { io, Socket } from 'socket.io-client'
import { useEffect, useRef } from 'react'

export function useSocket(url: string) {
  const ref = useRef<Socket | null>(null)
  useEffect(() => {
    ref.current = io(url, { autoConnect: true })
    return () => { ref.current?.disconnect() }
  }, [url])
  return ref
}

