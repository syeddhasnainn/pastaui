import type { ModelOption } from '@/components/ai/model-picker'

export const defaultModels: ModelOption[] = [
  {
    id: 'gpt-6-astra',
    name: 'GPT-6 Astra',
    provider: 'openai',
    description: 'Complex reasoning and coding',
  },
  {
    id: 'gpt-5.6-sol',
    name: 'GPT-5.6 Sol',
    provider: 'openai',
    description: 'Professional work and everyday tasks',
  },
  {
    id: 'claude-opus-5',
    name: 'Claude Opus 5',
    provider: 'claude',
    description: 'Complex tasks and extended analysis',
  },
  {
    id: 'claude-sonnet-5',
    name: 'Claude Sonnet 5',
    provider: 'claude',
    description: 'Everyday tasks and agentic coding',
  },
]

export const additionalModels: ModelOption[] = [
  {
    id: 'gpt-5.6-terra',
    name: 'GPT-5.6 Terra',
    provider: 'openai',
    description: 'Balanced capability and cost',
  },
  {
    id: 'gpt-5.6-luna',
    name: 'GPT-5.6 Luna',
    provider: 'openai',
    description: 'Fast, cost-sensitive workloads',
  },
  {
    id: 'claude-haiku-4-5',
    name: 'Claude Haiku 4.5',
    provider: 'claude',
    description: 'Quick answers and lightweight tasks',
  },
]
