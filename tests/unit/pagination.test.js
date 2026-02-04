/**
 * Pagination Utility Tests
 */

const Pagination = require('../../src/utils/pagination');

describe('Pagination Utility', () => {
    describe('parse()', () => {
        it('should parse page and limit from query', () => {
            const query = { page: '2', limit: '20' };
            const result = Pagination.parse(query);

            expect(result.page).toBe(2);
            expect(result.limit).toBe(20);
            expect(result.offset).toBe(20); // (2-1) * 20
        });

        it('should use default values when not provided', () => {
            const query = {};
            const result = Pagination.parse(query);

            expect(result.page).toBe(1);
            expect(result.limit).toBe(10);
            expect(result.offset).toBe(0);
        });

        it('should use custom default values', () => {
            const query = {};
            const result = Pagination.parse(query, { defaultPage: 1, defaultLimit: 25 });

            expect(result.limit).toBe(25);
        });

        it('should enforce maxLimit', () => {
            const query = { limit: '500' };
            const result = Pagination.parse(query, { maxLimit: 100 });

            expect(result.limit).toBe(100);
        });

        it('should handle invalid page values', () => {
            const query = { page: '-1' };
            const result = Pagination.parse(query);

            expect(result.page).toBe(1);
        });

        it('should handle non-numeric values', () => {
            const query = { page: 'abc', limit: 'xyz' };
            const result = Pagination.parse(query);

            expect(result.page).toBe(1);
            expect(result.limit).toBe(10);
        });
    });

    describe('createMeta()', () => {
        it('should create pagination metadata', () => {
            const meta = Pagination.createMeta(100, 2, 10);

            expect(meta.total).toBe(100);
            expect(meta.page).toBe(2);
            expect(meta.limit).toBe(10);
            expect(meta.totalPages).toBe(10);
            expect(meta.hasNextPage).toBe(true);
            expect(meta.hasPrevPage).toBe(true);
        });

        it('should indicate no next page on last page', () => {
            const meta = Pagination.createMeta(100, 10, 10);

            expect(meta.hasNextPage).toBe(false);
            expect(meta.hasPrevPage).toBe(true);
        });

        it('should indicate no prev page on first page', () => {
            const meta = Pagination.createMeta(100, 1, 10);

            expect(meta.hasNextPage).toBe(true);
            expect(meta.hasPrevPage).toBe(false);
        });

        it('should handle single page', () => {
            const meta = Pagination.createMeta(5, 1, 10);

            expect(meta.totalPages).toBe(1);
            expect(meta.hasNextPage).toBe(false);
            expect(meta.hasPrevPage).toBe(false);
        });

        it('should handle empty results', () => {
            const meta = Pagination.createMeta(0, 1, 10);

            expect(meta.total).toBe(0);
            expect(meta.totalPages).toBe(0);
        });
    });

    describe('sendResponse()', () => {
        it('should send response with pagination', () => {
            const mockRes = {
                json: jest.fn(),
            };

            const data = [{ id: 1 }, { id: 2 }];
            Pagination.sendResponse(mockRes, data, 100, 1, 10);

            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data,
                pagination: expect.objectContaining({
                    total: 100,
                    page: 1,
                    limit: 10,
                }),
            });
        });
    });
});
