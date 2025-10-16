import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateVehicleDescription = async (
  vehicleType: string,
  brand: string,
  modelName: string,
  color: string,
  engineSize: string,
  year: number,
  price: number
): Promise<string> => {
  try {
    const prompt = `Generate a creative and engaging sales description for a ${year} ${brand} ${modelName} ${vehicleType}. Key features: ${color} color, ${engineSize} engine. Price: $${price}. Make it appealing and highlight the vehicle's strengths. Keep it under 200 words.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional car salesman writing compelling vehicle descriptions.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() || 'Description not available';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate vehicle description');
  }
};