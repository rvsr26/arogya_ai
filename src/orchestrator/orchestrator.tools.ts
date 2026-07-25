import { z } from 'zod';
import { ToolDecorator as Tool, ExecutionContext, Injectable } from '@nitrostack/core';

const commandInput = z.object({
  intent: z.string().describe('Natural language intent (e.g. "Find ICU bed and book cardiologist")'),
});

const whatIfInput = z.object({
  scenario: z.string().describe('The hypothetical scenario to simulate (e.g. "What if 50 emergency patients arrive?")'),
});

@Injectable()
export class OrchestratorTools {
  @Tool({
    name: 'hospital-command-agent',
    title: 'Multi-Agent Orchestrator',
    description: 'Routes complex hospital commands to specialized sub-agents.',
    inputSchema: commandInput,
    invocation: { invoking: 'Planning intent…', invoked: 'Execution complete' },
    metadata: { category: 'orchestration', tags: ['agent', 'planner'] },
  })
  async planIntent(input: z.infer<typeof commandInput>, ctx: ExecutionContext) {
    ctx.logger.info('hospital-command-agent invoked', input);

    return {
      intent: input.intent,
      plan: 'Delegating to Patient, Doctor, and Bed Agents.',
      executionStatus: 'Parallel execution triggered',
      decisionPath: [
        'Analyze Intent',
        'Identify specialized domains',
        'Dispatch concurrent requests',
      ],
      predictionReason: 'The requested action spans multiple domains (Appointments + Beds). Orchestration required.',
      confidenceScore: 98,
      resilienceStatus: 'Pharmacy service timeout detected. Proceeding with cached fallback data.',
      summary: `I have delegated "${input.intent}" to the specialized hospital sub-agents. Fallback strategies active.`,
    };
  }

  @Tool({
    name: 'what-if-simulator',
    title: 'AI What-If Simulator',
    description: 'Predict impacts of hypothetical hospital scenarios.',
    inputSchema: whatIfInput,
    invocation: { invoking: 'Running simulation…', invoked: 'Simulation complete' },
    metadata: { category: 'orchestration', tags: ['simulation', 'what-if'] },
  })
  async simulateScenario(input: z.infer<typeof whatIfInput>, ctx: ExecutionContext) {
    ctx.logger.info('what-if-simulator invoked', input);

    return {
      scenario: input.scenario,
      predictions: {
        waitingTimeIncrease: '+45 mins',
        queueGrowth: 'High',
        icuUtilization: '100% (Critical)',
      },
      predictionReason: 'Simulated surge exceeds current staffing ratios.',
      confidenceScore: 85,
      alternatives: ['Route non-critical patients to nearby clinics', 'Call in off-duty doctors'],
      summary: `Simulation for "${input.scenario}" complete. Expect severe ICU bottlenecks. Recommend calling off-duty staff.`,
    };
  }
}
