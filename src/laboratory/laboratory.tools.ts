import { z } from 'zod';
import { ToolDecorator as Tool, ExecutionContext, Injectable } from '@nitrostack/core';
import { DatabaseService } from '../database/database.service.js';

const searchTestInput = z.object({
  query: z.string().describe('Name of the lab test (e.g. CBC, MRI)'),
});

const reportStatusInput = z.object({
  testId: z.string().describe('The ID of the booked lab test'),
});

@Injectable({ deps: [DatabaseService] })
export class LaboratoryTools {
  constructor(private readonly db: DatabaseService) {}

  @Tool({
    name: 'search-test',
    title: 'Search Lab Test',
    description: 'Find available lab tests and prices.',
    inputSchema: searchTestInput,
    invocation: { invoking: 'Searching lab tests…', invoked: 'Test search complete' },
    metadata: { category: 'laboratory', tags: ['lab', 'test', 'pathology'] },
  })
  async searchTest(input: z.infer<typeof searchTestInput>, ctx: ExecutionContext) {
    ctx.logger.info('search-test', input);
    const labModel = await this.db.labTests();
    const tests = await labModel.find({ name: { $regex: new RegExp(input.query, 'i') } }).lean().exec();
    
    return { tests, summary: `Found ${tests.length} tests matching "${input.query}".` };
  }

  @Tool({
    name: 'lab-report-status',
    title: 'Check Lab Report',
    description: 'Check the status of a patient\'s lab report.',
    inputSchema: reportStatusInput,
    invocation: { invoking: 'Checking report status…', invoked: 'Report status found' },
    metadata: { category: 'laboratory', tags: ['report', 'status'] },
  })
  async reportStatus(input: z.infer<typeof reportStatusInput>, ctx: ExecutionContext) {
    ctx.logger.info('lab-report-status', input);
    const labModel = await this.db.labTests();
    const test = await labModel.findOne({ testId: input.testId }).lean().exec();
    
    if (!test) return { error: true, message: 'Test not found' };

    return { 
      test, 
      summary: `The report for ${test.name} is currently ${test.reportStatus}. Expected delivery: ${test.expectedDelivery || 'TBD'}.` 
    };
  }
}
