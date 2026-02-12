import { describe, it, expect, vi, beforeEach } from 'vitest';
import { progressService } from '../../../src/services/ProgressService.js';
import { prisma } from '../../../src/config/database.js';

describe('ProgressService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initializeUserProgress', () => {
    it('should create 31 progress entries for new user', async () => {
      const userId = 'new-user-123';

      vi.mocked(prisma.user_progress.createMany).mockResolvedValue({
        count: 31,
      } as any);

      await progressService.initializeUserProgress(userId);

      expect(prisma.user_progress.createMany).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              user_id: userId,
              status: 'unlocked', // Sprint 0 should be unlocked
            }),
          ]),
        })
      );
    });

    it('should unlock only Sprint 0 by default', async () => {
      // Sprint 0 (WOOP) should be unlocked
      // Sprint 1-30 should be locked
      expect(31).toBe(31); // Total tools: 30 sprints + Sprint 30 overview
    });
  });

  describe('validateStatusTransition', () => {
    it('should allow locked -> unlocked transition', () => {
      const isValid = progressService.validateStatusTransition('locked', 'unlocked');
      expect(isValid).toBe(true);
    });

    it('should allow unlocked -> in_progress transition', () => {
      const isValid = progressService.validateStatusTransition('unlocked', 'in_progress');
      expect(isValid).toBe(true);
    });

    it('should allow in_progress -> completed transition', () => {
      const isValid = progressService.validateStatusTransition('in_progress', 'completed');
      expect(isValid).toBe(true);
    });

    it('should prevent locked -> completed transition', () => {
      const isValid = progressService.validateStatusTransition('locked', 'completed');
      expect(isValid).toBe(false);
    });

    it('should prevent completed -> locked transition', () => {
      const isValid = progressService.validateStatusTransition('completed', 'locked');
      expect(isValid).toBe(false);
    });
  });

  describe('calculateProgressPercentage', () => {
    it('should calculate 0% for empty submission', () => {
      const percentage = progressService.calculateProgressPercentage({}, ['field1', 'field2']);
      expect(percentage).toBe(0);
    });

    it('should calculate 50% for half-filled submission', () => {
      const data = {
        field1: 'value1',
      };
      const percentage = progressService.calculateProgressPercentage(data, ['field1', 'field2']);
      expect(percentage).toBe(50);
    });

    it('should calculate 100% for complete submission', () => {
      const data = {
        field1: 'value1',
        field2: 'value2',
      };
      const percentage = progressService.calculateProgressPercentage(data, ['field1', 'field2']);
      expect(percentage).toBe(100);
    });
  });

  describe('getProgressSummary', () => {
    it('should return summary with correct counts', async () => {
      const mockProgress = [
        { tool_slug: 'sprint-0-woop', status: 'completed' },
        { tool_slug: 'sprint-1-identity', status: 'in_progress' },
        { tool_slug: 'sprint-2-vision', status: 'unlocked' },
        { tool_slug: 'sprint-3-goals', status: 'locked' },
      ];

      vi.mocked(prisma.user_progress.findMany).mockResolvedValue(mockProgress as any);

      const summary = await progressService.getProgressSummary('user-123');

      expect(summary.total_tools).toBe(4);
      expect(summary.completed_tools).toBe(1);
      expect(summary.in_progress_tools).toBe(1);
      expect(summary.unlocked_tools).toBe(1);
      expect(summary.locked_tools).toBe(1);
    });
  });

  describe('getNextAvailableTool', () => {
    it('should return first unlocked tool', async () => {
      const mockProgress = [
        { tool_slug: 'sprint-0-woop', status: 'completed' },
        { tool_slug: 'sprint-1-identity', status: 'unlocked' },
        { tool_slug: 'sprint-2-vision', status: 'locked' },
      ];

      vi.mocked(prisma.user_progress.findMany).mockResolvedValue(mockProgress as any);

      const nextTool = await progressService.getNextAvailableTool('user-123');

      expect(nextTool?.tool_slug).toBe('sprint-1-identity');
    });

    it('should prefer in_progress over unlocked', async () => {
      const mockProgress = [
        { tool_slug: 'sprint-0-woop', status: 'completed' },
        { tool_slug: 'sprint-1-identity', status: 'in_progress' },
        { tool_slug: 'sprint-2-vision', status: 'unlocked' },
      ];

      vi.mocked(prisma.user_progress.findMany).mockResolvedValue(mockProgress as any);

      const nextTool = await progressService.getNextAvailableTool('user-123');

      expect(nextTool?.tool_slug).toBe('sprint-1-identity');
    });
  });

  describe('getTimeSpent', () => {
    it('should calculate time spent for completed tool', () => {
      const progress = {
        started_at: new Date('2024-01-01T10:00:00Z'),
        completed_at: new Date('2024-01-01T12:00:00Z'),
      };

      const hours = progressService.getTimeSpent(progress as any);

      expect(hours).toBe(2);
    });

    it('should return null for incomplete tool', () => {
      const progress = {
        started_at: new Date('2024-01-01T10:00:00Z'),
        completed_at: null,
      };

      const hours = progressService.getTimeSpent(progress as any);

      expect(hours).toBeNull();
    });
  });
});
