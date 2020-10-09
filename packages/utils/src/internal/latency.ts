/**
 * Simulates latency by resolving the returned promise after randomly chosen delay constrained with `minTimeout` and `maxTimeout`.
 *
 * @param minTimeout minimum number of milliseconds to wait
 * @param maxTimeout maximum number of milliseconds to wait
 * @param logMessage this message when provided, will be logged into the console along with the actual delay
 * @category Test Helper
 */
export function latency (minTimeout: number, maxTimeout: number, logMessage?: string): Promise<void>
/**
 * Simulates latency by resolving the returned promise after exactly `timeout` milliseconds.
 *
 * @param timeout number of milliseconds to wait
 * @param logMessage this message when provided, will be logged into the console along with the actual delay
 * @category Test Helper
 */
export function latency (timeout: number, logMessage?: string): Promise<void>

export function latency (minTimeout: number, maxTimeoutOrLogMessage?: number | string, optionalLogMessage?: string): Promise<void> {
  const timeout = typeof maxTimeoutOrLogMessage === 'number'
    ? Math.round(minTimeout + Math.random() * (maxTimeoutOrLogMessage - minTimeout))
    : minTimeout

  const logMessage = typeof maxTimeoutOrLogMessage === 'string' ? maxTimeoutOrLogMessage : optionalLogMessage
  if (logMessage != null) {
    console.log(logMessage, timeout, 'ms')
  }
  return new Promise(resolve => setTimeout(resolve, timeout))
}
