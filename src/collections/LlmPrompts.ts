import type { CollectionConfig } from 'payload'

export const LlmPrompts: CollectionConfig = {
  slug: 'llm-prompts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'module', 'active'],
    group: 'AI / LLM',
    description: 'Reusable prompt templates for future MCP/agent layer',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'module',
      type: 'select',
      options: [
        { label: 'Cross-cutting', value: 'cross' },
        { label: 'SPD', value: 'spd' },
        { label: 'Manufacturing', value: 'manufacturing' },
        { label: 'Finance', value: 'finance' },
        { label: 'Sales', value: 'sales' },
        { label: 'HR', value: 'hr' },
      ],
    },
    {
      name: 'systemPrompt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'userPromptTemplate',
      type: 'textarea',
      admin: { description: 'Use {{placeholders}} for runtime substitution' },
    },
    {
      name: 'allowedCollections',
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
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
