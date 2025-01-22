import OpenAI from 'openai'
import { Competitor } from '@/types/market'

// Export the initialized instance
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true  // Add this for client-side usage
})

export async function analyzeCompetitor(competitor: Competitor) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "You are a market analysis expert."
      }, {
        role: "user",
        content: `Analyze this competitor: ${JSON.stringify(competitor)}`
      }]
    })
    
    return response.choices[0].message.content
  } catch (error) {
    console.error('Error analyzing competitor:', error)
    throw error
  }
} 