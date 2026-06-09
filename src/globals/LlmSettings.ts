import type { GlobalConfig } from 'payload'

export const LlmSettings: GlobalConfig = {
  slug: 'llm-settings',
  label: 'LLM / MCP Settings',
  admin: {
    group: 'AI / LLM',
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'MCP plugin not installed yet — config placeholder' },
    },
    {
      name: 'provider',
      type: 'select',
      defaultValue: 'anthropic',
      options: [
        { label: 'Anthropic (Claude)', value: 'anthropic' },
        { label: 'OpenAI', value: 'openai' },
      ],
    },
    {
      name: 'defaultModel',
      type: 'text',
      admin: { description: 'Model slug when provider is configured' },
    },
    {
      name: 'mcpAllowedCollections',
      type: 'array',
      labels: { singular: 'Collection', plural: 'Collections' },
      fields: [
        {
          name: 'slug',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'rateLimitPerMinute',
      type: 'number',
      defaultValue: 30,
    },
  ],
}
