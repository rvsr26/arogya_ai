import { z } from 'zod';
import { ToolDecorator as Tool, ExecutionContext, Injectable } from '@nitrostack/core';
import { DatabaseService } from '../database/database.service.js';

const bedStatusInput = z.object({
  hospital: z.string().describe('Name of the hospital'),
  type: z.enum(['ICU', 'General', 'Emergency', 'Private', 'Semi-private']).describe('Type of bed'),
});

@Injectable({ deps: [DatabaseService] })
export class BedTools {
  constructor(private readonly db: DatabaseService) {}

  @Tool({
    name: 'bed-status',
    title: 'Check Bed Availability',
    description: 'Check real-time availability of hospital beds (e.g. ICU, General).',
    inputSchema: bedStatusInput,
    invocation: { invoking: 'Checking bed status…', invoked: 'Bed status found' },
    metadata: { category: 'operations', tags: ['hospital', 'bed', 'icu'] },
  })
  async getBedStatus(input: z.infer<typeof bedStatusInput>, ctx: ExecutionContext) {
    ctx.logger.info('bed-status', input);
    const bedModel = await this.db.beds();
    const beds = await bedModel.find({ hospital: input.hospital, type: input.type }).lean().exec();
    
    const available = beds.filter(b => b.status === 'Available').length;
    const occupied = beds.filter(b => b.status === 'Occupied').length;

    return {
      hospital: input.hospital,
      type: input.type,
      total: beds.length,
      available,
      occupied,
      summary: `Found ${available} available ${input.type} beds out of ${beds.length} at ${input.hospital}.`,
    };
  }
}
