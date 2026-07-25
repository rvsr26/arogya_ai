import { z } from 'zod';
import { ToolDecorator as Tool, ExecutionContext, Injectable } from '@nitrostack/core';

const emergencyInput = z.object({
  condition: z.string().describe('The emergency condition (e.g. chest pain, trauma)'),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']),
});

@Injectable()
export class IncidentTools {
  @Tool({
    name: 'incident-commander',
    title: 'AI Incident Commander',
    description: 'Coordinates multiple agents automatically during an emergency.',
    inputSchema: emergencyInput,
    invocation: { invoking: 'Declaring emergency…', invoked: 'Emergency protocol active' },
    metadata: { category: 'incident', tags: ['emergency', 'coordinator'] },
  })
  async coordinateEmergency(input: z.infer<typeof emergencyInput>, ctx: ExecutionContext) {
    ctx.logger.info('incident-commander invoked', input);
    
    return {
      incidentId: `INC-${Date.now()}`,
      condition: input.condition,
      severity: input.severity,
      triage: input.severity === 'Critical' ? 'Level 1 - Resuscitation' : 'Level 2 - Emergent',
      suggestedDepartment: input.condition.toLowerCase().includes('heart') || input.condition.toLowerCase().includes('chest') ? 'Cardiology ICU' : 'Trauma ER',
      timeline: [
        { time: new Date().toISOString(), agent: 'EmergencyAgent', action: 'Incident declared', status: 'Complete' },
        { time: new Date().toISOString(), agent: 'BedAgent', action: 'Reserve ICU bed', status: 'Demo Simulation: ICU Bed #42 Reserved' },
        { time: new Date().toISOString(), agent: 'DoctorAgent', action: 'Locate nearest specialist', status: 'Found (Dr. Sharma)' },
      ],
      predictionReason: `Based on severity "${input.severity}", aggressive ICU reservation is required.`,
      confidenceScore: 99,
      decisionPath: [
        'Analyze condition severity',
        'Check ICU capacity (Demo)',
        'Trigger specialist paging',
      ],
      escalationPath: 'If specialist unresponsive in 2 mins, page backup on-call doctor.',
      summary: `🚨 DEMO SIMULATION: Emergency protocol executed for ${input.condition}. ICU reserved and specialist notified.`,
    };
  }
}
