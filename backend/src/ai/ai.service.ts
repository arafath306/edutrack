import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateResponse(prompt: string, context?: string) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are EduAI, a friendly and smart educational assistant for the EduTrack platform. You help students with homework, explain complex topics in both English and Bangla, and generate study plans.',
        },
        {
          role: 'user',
          content: context ? `Context: ${context}\n\nQuestion: ${prompt}` : prompt,
        },
      ],
    });

    return response.choices[0].message.content;
  }

  async generateQuiz(topic: string, count: number = 5) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Generate a multiple-choice quiz in JSON format.',
        },
        {
          role: 'user',
          content: `Create a ${count}-question quiz on the topic: ${topic}`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('AI failed to generate quiz content');
    }

    return JSON.parse(content);
  }
}
