/**
 * API Features Utility
 * Kết hợp Pagination và QueryBuilder cho các use cases phổ biến
 */

const Pagination = require('./pagination');
const QueryBuilder = require('./queryBuilder');
const { Op } = require('sequelize');

class ApiFeatures {
    /**
     * Tạo query options cho danh sách với pagination, search, filter, sort
     * @param {Object} query - req.query object
     * @param {Object} options - Cấu hình
     * @returns {Object} { queryOptions, pagination }
     */
    static buildListQuery(query, options = {}) {
        const {
            searchFields = [], // Fields để search (vd: ['title', 'description'])
            filterFields = {}, // Map filter fields (vd: { status: 'eq', year: 'eq' })
            defaultSort = 'createdAt', // Default sort field
            defaultOrder = 'DESC', // Default sort order
            allowedSortFields = {}, // Map allowed sort fields
            defaultLimit = 10,
            maxLimit = 100,
        } = options;

        // Parse pagination
        const pagination = Pagination.parse(query, { defaultLimit, maxLimit });

        // Build query
        const builder = QueryBuilder.create();

        // Add search
        if (query.search && searchFields.length > 0) {
            builder.addSearch(query.search, searchFields);
        }

        // Add filters
        Object.entries(filterFields).forEach(([field, operator]) => {
            if (query[field] !== undefined) {
                builder.addWhere(field, query[field], operator);
            }
        });

        // Add sort
        if (query.sort) {
            builder.addOrderFromQuery(query.sort, allowedSortFields);
        } else {
            builder.addOrder(defaultSort, defaultOrder);
        }

        return {
            queryOptions: builder.build(pagination),
            pagination,
            builder, // Trả về builder để có thể customize thêm
        };
    }

    /**
     * Xử lý và trả về response với pagination
     * @param {Object} res - Express response
     * @param {Object} result - Kết quả từ findAndCountAll { count, rows }
     * @param {Object} pagination - { page, limit }
     */
    static sendPaginatedResponse(res, result, pagination) {
        const { count, rows } = result;
        return Pagination.sendResponse(res, rows, count, pagination.page, pagination.limit);
    }

    /**
     * Build date range filter
     * @param {string} startDate
     * @param {string} endDate
     * @returns {Object} Sequelize where clause cho date range
     */
    static buildDateRange(startDate, endDate) {
        if (!startDate && !endDate) return null;

        if (startDate && endDate) {
            return { [Op.between]: [new Date(startDate), new Date(endDate)] };
        }
        if (startDate) {
            return { [Op.gte]: new Date(startDate) };
        }
        if (endDate) {
            return { [Op.lte]: new Date(endDate) };
        }
    }

    /**
     * Parse các filter phổ biến từ query
     * @param {Object} query - req.query
     * @param {Object} schema - Schema định nghĩa các filter
     * @returns {Object} where clause
     */
    static parseFilters(query, schema) {
        const where = {};

        Object.entries(schema).forEach(([queryKey, config]) => {
            const value = query[queryKey];
            if (value === undefined || value === '') return;

            const { field = queryKey, type = 'string', operator = 'eq' } = config;

            let parsedValue = value;

            // Parse theo type
            switch (type) {
                case 'number':
                    parsedValue = parseInt(value);
                    if (isNaN(parsedValue)) return;
                    break;
                case 'boolean':
                    parsedValue = value === 'true' || value === '1';
                    break;
                case 'array':
                    parsedValue = Array.isArray(value) ? value : value.split(',');
                    break;
                case 'date':
                    parsedValue = new Date(value);
                    if (isNaN(parsedValue.getTime())) return;
                    break;
            }

            // Build operator
            const operators = {
                eq: () => parsedValue,
                like: () => ({ [Op.like]: `%${parsedValue}%` }),
                gt: () => ({ [Op.gt]: parsedValue }),
                gte: () => ({ [Op.gte]: parsedValue }),
                lt: () => ({ [Op.lt]: parsedValue }),
                lte: () => ({ [Op.lte]: parsedValue }),
                in: () => ({ [Op.in]: parsedValue }),
            };

            const buildOp = operators[operator];
            if (buildOp) {
                where[field] = buildOp();
            }
        });

        return where;
    }
}

module.exports = ApiFeatures;
