/**
 * Pagination Utility
 * Tiện ích phân trang có thể tái sử dụng
 */

class Pagination {
    /**
     * Parse pagination params từ query string
     * @param {Object} query - req.query object
     * @param {Object} options - default options
     * @returns {Object} { page, limit, offset }
     */
    static parse(query, options = {}) {
        const { defaultPage = 1, defaultLimit = 10, maxLimit = 100 } = options;

        let page = parseInt(query.page) || defaultPage;
        let limit = parseInt(query.limit) || defaultLimit;

        // Đảm bảo giá trị hợp lệ
        page = Math.max(1, page);
        limit = Math.min(Math.max(1, limit), maxLimit);

        const offset = (page - 1) * limit;

        return { page, limit, offset };
    }

    /**
     * Tạo pagination metadata từ kết quả query
     * @param {number} total - Tổng số records
     * @param {number} page - Trang hiện tại
     * @param {number} limit - Số items mỗi trang
     * @returns {Object} pagination object
     */
    static createMeta(total, page, limit) {
        const totalPages = Math.ceil(total / limit);

        return {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        };
    }

    /**
     * Helper để tạo response với pagination
     * @param {Object} res - Express response object
     * @param {Array} data - Dữ liệu trả về
     * @param {number} total - Tổng số records
     * @param {number} page - Trang hiện tại
     * @param {number} limit - Số items mỗi trang
     */
    static sendResponse(res, data, total, page, limit) {
        return res.json({
            success: true,
            data,
            pagination: this.createMeta(total, page, limit),
        });
    }
}

module.exports = Pagination;
