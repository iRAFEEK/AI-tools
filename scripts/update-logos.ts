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
      logoUrl: 'https://static.grammarly.com/assets/files/efe463ba3e5ccf96c963a2589cc7797f/apple-touch-icon-180x180.png',
    },
  })

  await prisma.tool.update({
    where: { slug: 'midjourney' },
    data: {
      logoUrl: 'https://styles.redditmedia.com/t5_wu0if/styles/communityIcon_2g14kv64jkz81.png',
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
      logoUrl: 'https://aeiljuispo.cloudimg.io/v7/https://s3.amazonaws.com/static.mlh.io/brand-assets/partners/stability-ai/logo.png',
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
