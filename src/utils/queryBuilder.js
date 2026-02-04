/**
 * Query Builder Utility
 * Tiện ích xây dựng query cho Sequelize
 */

const { Op } = require('sequelize');

class QueryBuilder {
    constructor() {
        this.where = {};
        this.include = [];
        this.order = [];
        this.attributes = null;
    }

    /**
     * Thêm điều kiện where
     * @param {string} field - Tên trường
     * @param {*} value - Giá trị
     * @param {string} operator - Operator (eq, like, gt, gte, lt, lte, in, between)
     * @returns {QueryBuilder}
     */
    addWhere(field, value, operator = 'eq') {
        if (value === undefined || value === null || value === '') {
            return this;
        }

        const operators = {
            eq: () => value,
            like: () => ({ [Op.like]: `%${value}%` }),
            startsWith: () => ({ [Op.like]: `${value}%` }),
            endsWith: () => ({ [Op.like]: `%${value}` }),
            gt: () => ({ [Op.gt]: value }),
            gte: () => ({ [Op.gte]: value }),
            lt: () => ({ [Op.lt]: value }),
            lte: () => ({ [Op.lte]: value }),
            in: () => ({ [Op.in]: Array.isArray(value) ? value : [value] }),
            notIn: () => ({ [Op.notIn]: Array.isArray(value) ? value : [value] }),
            between: () => ({ [Op.between]: value }),
            ne: () => ({ [Op.ne]: value }),
            or: () => ({ [Op.or]: value }),
        };

        const buildOperator = operators[operator];
        if (buildOperator) {
            this.where[field] = buildOperator();
        }

        return this;
    }

    /**
     * Thêm điều kiện search nhiều fields
     * @param {string} keyword - Từ khóa tìm kiếm
     * @param {Array} fields - Danh sách fields để search
     * @returns {QueryBuilder}
     */
    addSearch(keyword, fields) {
        if (!keyword || !fields || fields.length === 0) {
            return this;
        }

        this.where[Op.or] = fields.map((field) => ({
            [field]: { [Op.like]: `%${keyword}%` },
        }));

        return this;
    }

    /**
     * Thêm include relation
     * @param {Object} model - Sequelize model
     * @param {string} as - Alias
     * @param {Object} options - Các options khác (attributes, where, required, through)
     * @returns {QueryBuilder}
     */
    addInclude(model, as, options = {}) {
        const includeObj = { model, as, ...options };
        this.include.push(includeObj);
        return this;
    }

    /**
     * Thêm order by
     * @param {string} field - Tên trường
     * @param {string} direction - ASC hoặc DESC
     * @returns {QueryBuilder}
     */
    addOrder(field, direction = 'ASC') {
        this.order.push([field, direction.toUpperCase()]);
        return this;
    }

    /**
     * Thêm order từ query string (format: field:direction)
     * @param {string} sortString - Chuỗi sort (vd: "createdAt:desc" hoặc "title:asc")
     * @param {Object} allowedFields - Object map các fields được phép sort
     * @returns {QueryBuilder}
     */
    addOrderFromQuery(sortString, allowedFields = {}) {
        if (!sortString) {
            return this;
        }

        const [field, direction = 'asc'] = sortString.split(':');
        const actualField = allowedFields[field] || field;

        if (actualField) {
            this.addOrder(actualField, direction);
        }

        return this;
    }

    /**
     * Set attributes (select fields)
     * @param {Array} fields - Danh sách fields cần lấy
     * @returns {QueryBuilder}
     */
    setAttributes(fields) {
        if (fields && fields.length > 0) {
            this.attributes = fields;
        }
        return this;
    }

    /**
     * Exclude attributes
     * @param {Array} fields - Danh sách fields cần loại bỏ
     * @returns {QueryBuilder}
     */
    excludeAttributes(fields) {
        if (fields && fields.length > 0) {
            this.attributes = { exclude: fields };
        }
        return this;
    }

    /**
     * Build ra object options cho Sequelize query
     * @param {Object} pagination - { limit, offset } từ Pagination.parse()
     * @returns {Object}
     */
    build(pagination = null) {
        const options = {
            where: this.where,
        };

        if (this.include.length > 0) {
            options.include = this.include;
        }

        if (this.order.length > 0) {
            options.order = this.order;
        }

        if (this.attributes) {
            options.attributes = this.attributes;
        }

        if (pagination) {
            options.limit = pagination.limit;
            options.offset = pagination.offset;
        }

        return options;
    }

    /**
     * Build và thêm distinct (dùng khi có include many-to-many)
     * @param {Object} pagination
     * @returns {Object}
     */
    buildDistinct(pagination = null) {
        return {
            ...this.build(pagination),
            distinct: true,
        };
    }

    /**
     * Static method để tạo instance mới
     * @returns {QueryBuilder}
     */
    static create() {
        return new QueryBuilder();
    }
}

module.exports = QueryBuilder;
