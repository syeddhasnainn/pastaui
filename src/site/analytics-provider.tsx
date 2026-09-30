import { PostHogProvider } from '@posthog/react'
import type { ReactNode } from 'react'

import { analyticsApiHost, analyticsProjectToken, analyticsUiHost } from '#/lib/analytics'

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  if (!import.meta.env.PROD) return children

  return (
    <PostHogProvider
      apiKey={analyticsProjectToken}
      options={{
        api_host: analyticsApiHost,
        ui_host: analyticsUiHost,
        defaults: '2026-05-30',
      }}
    >
      {children}
    </PostHogProvider>
  )
}
