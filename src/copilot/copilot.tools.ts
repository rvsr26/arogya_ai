import { z } from 'zod';
import { ToolDecorator as Tool, ResourceDecorator as Resource, PromptDecorator as Prompt, Widget, ExecutionContext } from '@nitrostack/core';

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
    let questions = [
      'Could you tell me your age and gender?',
      'How long have you been experiencing this?',
      'How severe is it on a scale of 1-10?',
      'Do you have any existing medical conditions (like diabetes or high blood pressure)?',
      'Are you currently on any medication or have any allergies?',
    ];

    if (lowerSymptoms.includes('chest pain') || lowerSymptoms.includes('heart')) {
      specialty = 'Cardiologist';
      questions.push('Is the pain spreading to your arm, neck, or jaw?');
      questions.push('Are you experiencing any shortness of breath or sweating?');
    } else if (lowerSymptoms.includes('skin') || lowerSymptoms.includes('rash')) {
      specialty = 'Dermatologist';
      questions.push('Is the rash itchy or spreading?');
      questions.push('Have you tried any creams or treatments yet?');
    } else if (lowerSymptoms.includes('bone') || lowerSymptoms.includes('joint')) {
      specialty = 'Orthopaedic Surgeon';
      questions.push('Did you have a recent fall or physical injury?');
      questions.push('Is there any visible swelling or redness?');
    }

    return {
      symptoms: input.symptoms,
      recommendedSpecialty: specialty,
      followUpQuestions: questions,
      disclaimer: "⚠️ **Disclaimer**: This is a demo simulation and not a medical diagnosis. Please consult a registered medical practitioner.",
      summary: `I've analyzed your symptoms. Based on this, a ${specialty} is recommended. Next step: Ask the patient the follow-up questions to gather more clinical context.`,
      nextStep: 'Offer to call search-doctors for the recommended specialty after gathering basic triage info.',
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

  @Resource({
    uri: 'hospital://guidelines/triage',
    name: 'Hospital Triage Guidelines',
    description: 'Standard operating procedures for emergency triage and leveling.',
    mimeType: 'text/plain',
  })
  async getTriageGuidelines(ctx: ExecutionContext) {
    return 'Level 1: Resuscitation (Immediate). Level 2: Emergent (15 mins). Level 3: Urgent (30 mins).';
  }

  @Prompt({
    name: 'triage_assistant',
    description: 'System prompt template for initializing a specialized medical triage assistant.',
    arguments: [
      { name: 'specialty', description: 'The required medical specialty focus', required: true }
    ],
  })
  async getTriagePrompt(args: { specialty: string }, ctx: ExecutionContext) {
    return {
      messages: [
        {
          role: 'system',
          content: `You are an expert ${args.specialty} triage assistant. Evaluate symptoms carefully, ask follow-up questions regarding age, duration, and severity. Do not diagnose.`
        }
      ]
    };
  }
}
