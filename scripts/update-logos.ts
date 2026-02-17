import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateLogos() {
  console.log('🔄 Updating tool logos...')

  // Update logos with better URLs
  await prisma.tool.update({
    where: { slug: 'perplexity-ai' },
    data: {
      logoUrl: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/perplexity-ai-icon.png',
    },
  })

  await prisma.tool.update({
    where: { slug: 'grammarly' },
    data: {
      logoUrl: 'https://avatars.githubusercontent.com/u/22717754?s=200&v=4',
    },
  })

  await prisma.tool.update({
    where: { slug: 'midjourney' },
    data: {
      logoUrl: 'https://seeklogo.com/images/M/midjourney-logo-3BAF817F3F-seeklogo.com.png',
    },
  })

  await prisma.tool.update({
    where: { slug: 'chatgpt' },
    data: {
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png',
    },
  })

  await prisma.tool.update({
    where: { slug: 'dall-e-3' },
    data: {
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png',
    },
  })

  await prisma.tool.update({
    where: { slug: 'stable-diffusion' },
    data: {
      logoUrl: 'https://avatars.githubusercontent.com/u/99127326?s=200&v=4',
    },
  })

  await prisma.tool.update({
    where: { slug: 'cursor' },
    data: {
      logoUrl: 'https://www.cursor.com/brand/icon.svg',
    },
  })

  console.log('✅ All logos updated!')
}

updateLogos()
  .catch((e) => {
    console.error('❌ Error updating logos:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
