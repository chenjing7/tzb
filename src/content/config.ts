import { defineCollection, z } from 'astro:content';

// 定义 MDA 内容集合
const mdaCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    company: z.string().optional(),
    year: z.number().optional(),
  }),
});

// 定义致股东信内容集合
const lettersCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    company: z.string().optional(),
    year: z.number().optional(),
  }),
});

const featuredCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string(),
    author: z.string().default('Lin'),
  }),
});

// 导出集合配置
export const collections = {
  'mda': mdaCollection,
  'letters': lettersCollection,
  'featured': featuredCollection,
}; 