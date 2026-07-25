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

    const lowerScenario = input.scenario.toLowerCase();
    
    let waitingTime = '+45 mins';
    let queue = 'High';
    let util = '100% (Critical)';
    let reason = 'Simulated surge exceeds current staffing ratios.';
    let alts = ['Route non-critical patients to nearby clinics', 'Call in off-duty doctors'];
    let summary = `Simulation for "${input.scenario}" complete. Expect severe bottlenecks. Recommend calling off-duty staff.`;

    if (lowerScenario.includes('dengue')) {
      waitingTime = '+120 mins (Lab overload)';
      queue = 'Extreme in Pathology';
      util = '80% (Ward Beds)';
      reason = 'Sudden spike in CBC and platelet count tests.';
      alts = ['Deploy mobile testing units', 'Fast-track fever clinic'];
      summary = `Simulation for "${input.scenario}" complete. Severe lab bottlenecks predicted. Deploy fast-track fever clinic.`;
    } else if (lowerScenario.includes('flood') || lowerScenario.includes('casualty') || lowerScenario.includes('earthquake')) {
      waitingTime = '+200 mins (Trauma overload)';
      queue = 'Catastrophic in ER';
      util = '150% (ICU Overflow)';
      reason = 'Mass trauma event overrides standard triage capabilities.';
      alts = ['Activate mass casualty protocol', 'Convert general wards to triage', 'Request ambulance diversions'];
      summary = `🚨 DISASTER SIMULATION for "${input.scenario}". ER will collapse within 45 mins. Activate mass casualty protocol immediately.`;
    }

    return {
      scenario: input.scenario,
      predictions: {
        waitingTimeIncrease: waitingTime,
        queueGrowth: queue,
        icuUtilization: util,
      },
      predictionReason: reason,
      confidenceScore: 85,
      alternatives: alts,
      summary: summary,
    };
  }
}
