import { AiAgentPreview } from '#/components/docs/previews/ai-agent-previews'

interface ComponentPreviewProps {
  slug: string
}

export function ComponentPreview({ slug }: ComponentPreviewProps) {
  return <AiAgentPreview slug={slug} />
}
