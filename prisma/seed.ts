import { PrismaClient, PricingType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data (optional - comment out if you want to keep existing data)
  await prisma.toolTag.deleteMany()
  await prisma.toolCategory.deleteMany()
  await prisma.tool.deleteMany()
  await prisma.category.deleteMany()
  await prisma.tag.deleteMany()

  // Create Categories
  console.log('📁 Creating categories...')
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Development',
        slug: 'development',
        description: 'AI tools for coding, debugging, and software development',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Design',
        slug: 'design',
        description: 'AI tools for graphic design, UI/UX, and creative work',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Writing',
        slug: 'writing',
        description: 'AI tools for content creation, copywriting, and editing',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Research',
        slug: 'research',
        description: 'AI tools for research, data analysis, and insights',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Productivity',
        slug: 'productivity',
        description: 'AI tools to boost productivity and automate tasks',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Image Generation',
        slug: 'image-generation',
        description: 'AI tools for generating and editing images',
      },
    }),
  ])
  console.log(`✅ Created ${categories.length} categories`)

  // Create Tags
  console.log('🏷️  Creating tags...')
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'Code Completion', slug: 'code-completion' } }),
    prisma.tag.create({ data: { name: 'Chatbot', slug: 'chatbot' } }),
    prisma.tag.create({ data: { name: 'Image Generation', slug: 'image-generation' } }),
    prisma.tag.create({ data: { name: 'Text-to-Image', slug: 'text-to-image' } }),
    prisma.tag.create({ data: { name: 'Free Tier', slug: 'free-tier' } }),
    prisma.tag.create({ data: { name: 'API Available', slug: 'api-available' } }),
    prisma.tag.create({ data: { name: 'Open Source', slug: 'open-source' } }),
    prisma.tag.create({ data: { name: 'Beginner Friendly', slug: 'beginner-friendly' } }),
  ])
  console.log(`✅ Created ${tags.length} tags`)

  // Create Sample Tools
  console.log('🛠️  Creating sample tools...')

  // 1. ChatGPT
  await prisma.tool.create({
    data: {
      name: 'ChatGPT',
      slug: 'chatgpt',
      description: 'Advanced AI chatbot for conversations, writing, coding, and problem-solving',
      longDescription:
        'ChatGPT is an advanced AI language model developed by OpenAI. It can assist with a wide variety of tasks including writing, coding, research, brainstorming, and more. The tool uses natural language processing to understand context and provide helpful, detailed responses.',
      websiteUrl: 'https://chat.openai.com',
      logoUrl: 'https://cdn.oaistatic.com/_next/static/media/apple-touch-icon.59f2e898.png',
      pricingType: PricingType.FREEMIUM,
      pricingDetails: 'Free tier available. ChatGPT Plus: $20/month for GPT-4 access',
      hasFreeTier: true,
      categories: {
        create: [
          { category: { connect: { slug: 'writing' } } },
          { category: { connect: { slug: 'development' } } },
          { category: { connect: { slug: 'research' } } },
        ],
      },
      tags: {
        create: [
          { tag: { connect: { slug: 'chatbot' } } },
          { tag: { connect: { slug: 'free-tier' } } },
          { tag: { connect: { slug: 'api-available' } } },
          { tag: { connect: { slug: 'beginner-friendly' } } },
        ],
      },
    },
  })

  // 2. GitHub Copilot
  await prisma.tool.create({
    data: {
      name: 'GitHub Copilot',
      slug: 'github-copilot',
      description: 'AI pair programmer that suggests code and entire functions in real-time',
      longDescription:
        'GitHub Copilot is an AI-powered code completion tool developed by GitHub and OpenAI. It provides intelligent code suggestions based on the context of your code and comments. Copilot can help you write code faster, discover new APIs, and learn best practices.',
      websiteUrl: 'https://github.com/features/copilot',
      logoUrl: 'https://github.githubassets.com/images/modules/site/copilot/copilot.png',
      pricingType: PricingType.SUBSCRIPTION,
      pricingDetails: '$10/month for individuals, $19/user/month for businesses. Free for students and open source maintainers',
      hasFreeTier: false,
      categories: {
        create: [{ category: { connect: { slug: 'development' } } }],
      },
      tags: {
        create: [
          { tag: { connect: { slug: 'code-completion' } } },
          { tag: { connect: { slug: 'api-available' } } },
        ],
      },
    },
  })

  // 3. Midjourney
  await prisma.tool.create({
    data: {
      name: 'Midjourney',
      slug: 'midjourney',
      description: 'AI image generator that creates stunning artwork from text descriptions',
      longDescription:
        'Midjourney is an independent research lab that produces an AI program that creates images from textual descriptions. It is known for producing high-quality, artistic images and is widely used by designers, artists, and creators for concept art, illustrations, and creative projects.',
      websiteUrl: 'https://www.midjourney.com',
      logoUrl: 'https://www.midjourney.com/apple-touch-icon.png',
      pricingType: PricingType.SUBSCRIPTION,
      pricingDetails: 'Basic: $10/month, Standard: $30/month, Pro: $60/month',
      hasFreeTier: false,
      categories: {
        create: [
          { category: { connect: { slug: 'design' } } },
          { category: { connect: { slug: 'image-generation' } } },
        ],
      },
      tags: {
        create: [
          { tag: { connect: { slug: 'image-generation' } } },
          { tag: { connect: { slug: 'text-to-image' } } },
        ],
      },
    },
  })

  // 4. Grammarly
  await prisma.tool.create({
    data: {
      name: 'Grammarly',
      slug: 'grammarly',
      description: 'AI writing assistant for grammar, spelling, and style suggestions',
      longDescription:
        'Grammarly is an AI-powered writing assistant that helps you write clear, mistake-free content. It checks for grammar, spelling, punctuation, and style issues in real-time across multiple platforms. Grammarly also provides suggestions for clarity, engagement, and delivery.',
      websiteUrl: 'https://www.grammarly.com',
      logoUrl: 'https://static.grammarly.com/assets/files/efe463ba3e5ccf96c963a2589cc7797f/favicon.svg',
      pricingType: PricingType.FREEMIUM,
      pricingDetails: 'Free basic version. Premium: $12/month (annual billing)',
      hasFreeTier: true,
      categories: {
        create: [
          { category: { connect: { slug: 'writing' } } },
          { category: { connect: { slug: 'productivity' } } },
        ],
      },
      tags: {
        create: [
          { tag: { connect: { slug: 'free-tier' } } },
          { tag: { connect: { slug: 'beginner-friendly' } } },
        ],
      },
    },
  })

  // 5. Notion AI
  await prisma.tool.create({
    data: {
      name: 'Notion AI',
      slug: 'notion-ai',
      description: 'AI-powered writing and productivity features integrated into Notion',
      longDescription:
        'Notion AI is built directly into Notion, offering AI-powered writing assistance, content generation, and productivity features. It can help you write, brainstorm, edit, summarize, and translate content without leaving your Notion workspace.',
      websiteUrl: 'https://www.notion.so/product/ai',
      logoUrl: 'https://www.notion.so/images/favicon.ico',
      pricingType: PricingType.SUBSCRIPTION,
      pricingDetails: '$10/member/month as an add-on to Notion',
      hasFreeTier: false,
      categories: {
        create: [
          { category: { connect: { slug: 'writing' } } },
          { category: { connect: { slug: 'productivity' } } },
        ],
      },
      tags: {
        create: [{ tag: { connect: { slug: 'beginner-friendly' } } }],
      },
    },
  })

  // 6. DALL-E 3
  await prisma.tool.create({
    data: {
      name: 'DALL-E 3',
      slug: 'dall-e-3',
      description: 'OpenAI\'s latest AI model for generating images from text descriptions',
      longDescription:
        'DALL-E 3 is OpenAI\'s most advanced text-to-image model. It can create highly detailed and accurate images from textual descriptions, with improved understanding of nuance and detail compared to previous versions. It\'s integrated into ChatGPT Plus and available via API.',
      websiteUrl: 'https://openai.com/dall-e-3',
      logoUrl: 'https://cdn.oaistatic.com/_next/static/media/apple-touch-icon.59f2e898.png',
      pricingType: PricingType.PAID,
      pricingDetails: 'Available via ChatGPT Plus ($20/month) or API ($0.04-$0.12 per image)',
      hasFreeTier: false,
      categories: {
        create: [
          { category: { connect: { slug: 'design' } } },
          { category: { connect: { slug: 'image-generation' } } },
        ],
      },
      tags: {
        create: [
          { tag: { connect: { slug: 'image-generation' } } },
          { tag: { connect: { slug: 'text-to-image' } } },
          { tag: { connect: { slug: 'api-available' } } },
        ],
      },
    },
  })

  // 7. Perplexity AI
  await prisma.tool.create({
    data: {
      name: 'Perplexity AI',
      slug: 'perplexity-ai',
      description: 'AI-powered search engine that provides direct answers with sources',
      longDescription:
        'Perplexity AI is an AI-powered answer engine that delivers accurate answers to complex questions with cited sources. It combines the power of large language models with real-time web search to provide up-to-date, sourced information.',
      websiteUrl: 'https://www.perplexity.ai',
      logoUrl: 'https://www.perplexity.ai/favicon.svg',
      pricingType: PricingType.FREEMIUM,
      pricingDetails: 'Free basic version. Pro: $20/month for unlimited queries',
      hasFreeTier: true,
      categories: {
        create: [
          { category: { connect: { slug: 'research' } } },
          { category: { connect: { slug: 'productivity' } } },
        ],
      },
      tags: {
        create: [
          { tag: { connect: { slug: 'free-tier' } } },
          { tag: { connect: { slug: 'beginner-friendly' } } },
        ],
      },
    },
  })

  // 8. Cursor
  await prisma.tool.create({
    data: {
      name: 'Cursor',
      slug: 'cursor',
      description: 'AI-first code editor built for pair programming with AI',
      longDescription:
        'Cursor is an AI-first code editor designed to help you code faster. It features AI-powered code generation, editing, and debugging capabilities. Built on top of VS Code, it provides a familiar interface with powerful AI assistance integrated throughout your workflow.',
      websiteUrl: 'https://cursor.sh',
      logoUrl: 'https://cursor.sh/favicon.ico',
      pricingType: PricingType.FREEMIUM,
      pricingDetails: 'Free for individuals. Pro: $20/month for more AI features',
      hasFreeTier: true,
      categories: {
        create: [{ category: { connect: { slug: 'development' } } }],
      },
      tags: {
        create: [
          { tag: { connect: { slug: 'code-completion' } } },
          { tag: { connect: { slug: 'free-tier' } } },
        ],
      },
    },
  })

  // 9. Stable Diffusion
  await prisma.tool.create({
    data: {
      name: 'Stable Diffusion',
      slug: 'stable-diffusion',
      description: 'Open-source AI model for generating images from text',
      longDescription:
        'Stable Diffusion is an open-source text-to-image model that can generate detailed images from text descriptions. Being open-source, it can be run locally or through various online services, giving users more control and flexibility compared to proprietary alternatives.',
      websiteUrl: 'https://stability.ai/stable-diffusion',
      logoUrl: 'https://stability.ai/favicon.ico',
      pricingType: PricingType.OPEN_SOURCE,
      pricingDetails: 'Free and open-source. Can run locally or use various cloud services',
      hasFreeTier: true,
      categories: {
        create: [
          { category: { connect: { slug: 'design' } } },
          { category: { connect: { slug: 'image-generation' } } },
        ],
      },
      tags: {
        create: [
          { tag: { connect: { slug: 'image-generation' } } },
          { tag: { connect: { slug: 'text-to-image' } } },
          { tag: { connect: { slug: 'open-source' } } },
          { tag: { connect: { slug: 'free-tier' } } },
        ],
      },
    },
  })

  // 10. Claude
  await prisma.tool.create({
    data: {
      name: 'Claude',
      slug: 'claude',
      description: 'Advanced AI assistant by Anthropic for conversations, analysis, and coding',
      longDescription:
        'Claude is an AI assistant created by Anthropic. It excels at thoughtful dialogue, content creation, complex reasoning, and coding assistance. Claude is designed to be helpful, harmless, and honest, with strong capabilities in analysis, writing, math, and programming.',
      websiteUrl: 'https://claude.ai',
      logoUrl: 'https://claude.ai/favicon.ico',
      pricingType: PricingType.FREEMIUM,
      pricingDetails: 'Free tier available. Pro: $20/month for higher usage limits',
      hasFreeTier: true,
      categories: {
        create: [
          { category: { connect: { slug: 'writing' } } },
          { category: { connect: { slug: 'development' } } },
          { category: { connect: { slug: 'research' } } },
        ],
      },
      tags: {
        create: [
          { tag: { connect: { slug: 'chatbot' } } },
          { tag: { connect: { slug: 'free-tier' } } },
          { tag: { connect: { slug: 'api-available' } } },
          { tag: { connect: { slug: 'beginner-friendly' } } },
        ],
      },
    },
  })

  console.log('✅ Created 10 sample tools')

  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📊 Summary:')
  const toolCount = await prisma.tool.count()
  const categoryCount = await prisma.category.count()
  const tagCount = await prisma.tag.count()
  console.log(`   - ${categoryCount} categories`)
  console.log(`   - ${tagCount} tags`)
  console.log(`   - ${toolCount} tools`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
