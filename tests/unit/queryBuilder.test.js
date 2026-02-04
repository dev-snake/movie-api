/**
 * QueryBuilder Utility Tests
 */

const QueryBuilder = require('../../src/utils/queryBuilder');
const { Op } = require('sequelize');

describe('QueryBuilder Utility', () => {
    describe('create()', () => {
        it('should create a new QueryBuilder instance', () => {
            const builder = QueryBuilder.create();
            expect(builder).toBeInstanceOf(QueryBuilder);
        });
    });

    describe('addWhere()', () => {
        it('should add equal condition', () => {
            const builder = QueryBuilder.create();
            builder.addWhere('status', 'published');

            const options = builder.build();
            expect(options.where.status).toBe('published');
        });

        it('should add like condition', () => {
            const builder = QueryBuilder.create();
            builder.addWhere('title', 'test', 'like');

            const options = builder.build();
            expect(options.where.title).toEqual({ [Op.like]: '%test%' });
        });

        it('should add greater than condition', () => {
            const builder = QueryBuilder.create();
            builder.addWhere('views', 100, 'gt');

            const options = builder.build();
            expect(options.where.views).toEqual({ [Op.gt]: 100 });
        });

        it('should add in condition', () => {
            const builder = QueryBuilder.create();
            builder.addWhere('status', ['published', 'draft'], 'in');

            const options = builder.build();
            expect(options.where.status).toEqual({ [Op.in]: ['published', 'draft'] });
        });

        it('should skip null/undefined values', () => {
            const builder = QueryBuilder.create();
            builder.addWhere('status', null);
            builder.addWhere('type', undefined);
            builder.addWhere('title', '');

            const options = builder.build();
            expect(Object.keys(options.where)).toHaveLength(0);
        });

        it('should support chaining', () => {
            const builder = QueryBuilder.create()
                .addWhere('status', 'published')
                .addWhere('type', 'single');

            const options = builder.build();
            expect(options.where.status).toBe('published');
            expect(options.where.type).toBe('single');
        });
    });

    describe('addSearch()', () => {
        it('should add search across multiple fields', () => {
            const builder = QueryBuilder.create();
            builder.addSearch('test', ['title', 'description']);

            const options = builder.build();
            expect(options.where[Op.or]).toBeDefined();
            expect(options.where[Op.or]).toHaveLength(2);
        });

        it('should skip empty keyword', () => {
            const builder = QueryBuilder.create();
            builder.addSearch('', ['title']);

            const options = builder.build();
            expect(options.where[Op.or]).toBeUndefined();
        });
    });

    describe('addOrder()', () => {
        it('should add order clause', () => {
            const builder = QueryBuilder.create();
            builder.addOrder('createdAt', 'DESC');

            const options = builder.build();
            expect(options.order).toContainEqual(['createdAt', 'DESC']);
        });

        it('should support multiple orders', () => {
            const builder = QueryBuilder.create()
                .addOrder('createdAt', 'DESC')
                .addOrder('title', 'ASC');

            const options = builder.build();
            expect(options.order).toHaveLength(2);
        });
    });

    describe('addOrderFromQuery()', () => {
        it('should parse sort string', () => {
            const builder = QueryBuilder.create();
            builder.addOrderFromQuery('createdAt:desc');

            const options = builder.build();
            expect(options.order).toContainEqual(['createdAt', 'DESC']);
        });

        it('should use allowed fields mapping', () => {
            const builder = QueryBuilder.create();
            builder.addOrderFromQuery('year:asc', { year: 'releaseYear' });

            const options = builder.build();
            expect(options.order).toContainEqual(['releaseYear', 'ASC']);
        });

        it('should default to ASC', () => {
            const builder = QueryBuilder.create();
            builder.addOrderFromQuery('title');

            const options = builder.build();
            expect(options.order).toContainEqual(['title', 'ASC']);
        });
    });

    describe('build()', () => {
        it('should include pagination when provided', () => {
            const builder = QueryBuilder.create();
            const pagination = { limit: 10, offset: 20 };

            const options = builder.build(pagination);
            expect(options.limit).toBe(10);
            expect(options.offset).toBe(20);
        });

        it('should not include pagination when not provided', () => {
            const builder = QueryBuilder.create();

            const options = builder.build();
            expect(options.limit).toBeUndefined();
            expect(options.offset).toBeUndefined();
        });
    });

    describe('buildDistinct()', () => {
        it('should include distinct: true', () => {
            const builder = QueryBuilder.create();

            const options = builder.buildDistinct();
            expect(options.distinct).toBe(true);
        });
    });

    describe('setAttributes()', () => {
        it('should set attributes', () => {
            const builder = QueryBuilder.create();
            builder.setAttributes(['id', 'name', 'email']);

            const options = builder.build();
            expect(options.attributes).toEqual(['id', 'name', 'email']);
        });
    });

    describe('excludeAttributes()', () => {
        it('should exclude attributes', () => {
            const builder = QueryBuilder.create();
            builder.excludeAttributes(['password']);

            const options = builder.build();
            expect(options.attributes).toEqual({ exclude: ['password'] });
        });
    });
});
