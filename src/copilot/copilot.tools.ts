import { z } from 'zod';
import { ToolDecorator as Tool, Widget, ExecutionContext } from '@nitrostack/core';

const healthAssistantInput = z.object({
  symptoms: z.string().describe('The symptoms described by the patient.'),
});

const reportEmergencyInput = z.object({
  emergencyType: z.string().describe('The detected emergency phrase or condition (e.g., "chest pain").'),
});

export class CopilotTools {
  @Tool({
    name: 'health-assistant',
    title: 'Health Assistant Copilot',
    description: 'Understand symptoms, estimate urgency, and recommend a medical specialty. IMPORTANT: Never diagnose diseases.',
    inputSchema: healthAssistantInput,
    invocation: {
      invoking: 'Analyzing symptoms…',
      invoked: 'Analysis complete',
    },
    metadata: { category: 'copilot', tags: ['symptoms', 'triage'] },
  })
  async healthAssistant(input: z.infer<typeof healthAssistantInput>, ctx: ExecutionContext) {
    ctx.logger.info('health-assistant invoked', { symptoms: input.symptoms });

    const lowerSymptoms = input.symptoms.toLowerCase();
    let specialty = 'General Physician';
    let questions = ['How long have you been experiencing this?'];

    if (lowerSymptoms.includes('chest pain') || lowerSymptoms.includes('heart')) {
      specialty = 'Cardiologist';
      questions = ['Is the pain spreading to your arm or jaw?', 'Any breathing difficulty?'];
    } else if (lowerSymptoms.includes('skin') || lowerSymptoms.includes('rash')) {
      specialty = 'Dermatologist';
      questions = ['Is the rash itchy?', 'Have you tried any creams?'];
    } else if (lowerSymptoms.includes('bone') || lowerSymptoms.includes('joint')) {
      specialty = 'Orthopaedic Surgeon';
      questions = ['Did you have a recent fall or injury?', 'Is there any swelling?'];
    }

    return {
      symptoms: input.symptoms,
      recommendedSpecialty: specialty,
      followUpQuestions: questions,
      disclaimer: "This is not a medical diagnosis. Please consult a registered medical practitioner.",
      summary: `I've analyzed your symptoms. Based on this, a ${specialty} is recommended. Next step: Ask the patient the follow-up questions or offer to search for a ${specialty}.`,
      nextStep: 'Offer to call search-doctors for the recommended specialty.',
    };
  }

  @Tool({
    name: 'report-emergency',
    title: 'Emergency Protocol',
    description: 'Trigger this tool IMMEDIATELY if you detect emergency phrases like "chest pain", "heart attack", "stroke", "can\'t breathe".',
    inputSchema: reportEmergencyInput,
    invocation: {
      invoking: 'Triggering emergency protocol…',
      invoked: 'Emergency protocol active',
    },
    metadata: { category: 'copilot', tags: ['emergency'] },
  })
  @Widget({
    route: 'emergency',
    prefersBorder: false,
  })
  async reportEmergency(input: z.infer<typeof reportEmergencyInput>, ctx: ExecutionContext) {
    ctx.logger.warn?.('Emergency detected!', { emergencyType: input.emergencyType });

    return {
      emergencyType: input.emergencyType,
      nearestHospital: 'Apollo Emergency Center (Estimated 2 km)',
      emergencyNumber: '102 / 108',
      action: 'Do NOT continue normal appointment booking until the user confirms they are safe.',
      summary: `EMERGENCY PROTOCOL TRIGGERED for "${input.emergencyType}". User must confirm they are safe before proceeding.`,
    };
  }
}
