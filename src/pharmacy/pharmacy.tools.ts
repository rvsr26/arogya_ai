import { z } from 'zod';
import { ToolDecorator as Tool, ExecutionContext, Injectable } from '@nitrostack/core';
import { DatabaseService } from '../database/database.service.js';

const searchMedicineInput = z.object({
  query: z.string().describe('Name of the medicine to search for'),
});

@Injectable({ deps: [DatabaseService] })
export class PharmacyTools {
  constructor(private readonly db: DatabaseService) {}

  @Tool({
    name: 'medicine-search',
    title: 'Search Medicine',
    description: 'Search the pharmacy inventory for a medicine and check availability, stock, and alternatives.',
    inputSchema: searchMedicineInput,
    invocation: { invoking: 'Searching pharmacy…', invoked: 'Medicine search complete' },
    metadata: { category: 'pharmacy', tags: ['medicine', 'drugs', 'inventory'] },
  })
  async searchMedicine(input: z.infer<typeof searchMedicineInput>, ctx: ExecutionContext) {
    ctx.logger.info('medicine-search', input);
    const medModel = await this.db.medicines();
    
    // Fuzzy search using regex
    const regex = new RegExp(input.query, 'i');
    const medicines = await medModel.find({ name: { $regex: regex } }).lean().exec();

    if (medicines.length === 0) {
      return { found: false, summary: `No medicines found matching "${input.query}".` };
    }

    return {
      found: true,
      medicines,
      summary: `Found ${medicines.length} matching medicines.`,
    };
  }
}
