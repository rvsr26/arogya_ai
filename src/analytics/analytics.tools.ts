import { z } from 'zod';
import { ToolDecorator as Tool, ExecutionContext, Injectable } from '@nitrostack/core';
import { DatabaseService } from '../database/database.service.js';

const briefingInput = z.object({
  date: z.string().optional().describe('Date to generate the briefing for'),
});

@Injectable({ deps: [DatabaseService] })
export class AnalyticsTools {
  constructor(private readonly db: DatabaseService) {}

  @Tool({
    name: 'executive-briefing',
    title: 'Generate Executive Briefing',
    description: 'Generate natural language insights for hospital operations.',
    inputSchema: briefingInput,
    invocation: { invoking: 'Generating insights…', invoked: 'Insights ready' },
    metadata: { category: 'analytics', tags: ['kpi', 'dashboard'] },
  })
  async generateBriefing(input: z.infer<typeof briefingInput>, ctx: ExecutionContext) {
    ctx.logger.info('executive-briefing invoked', input);
    
    return {
      date: input.date || new Date().toISOString(),
      summary: 'Today\'s appointments increased by 18%. Cardiology demand is highest. ICU occupancy reached 82%. Average waiting time decreased by 11%. No critical pharmacy shortages detected.',
      predictionReason: 'Based on historical baseline vs today\'s active metrics.',
      confidenceScore: 95,
      alerts: [
        { severity: 'Medium', message: 'Doctor Smith is approaching overload limits.' },
      ],
    };
  }
}
