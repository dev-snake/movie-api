// Success response
exports.successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

// Error response
exports.errorResponse = (res, message = 'Error', statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};

// Pagination response
exports.paginatedResponse = (res, data, pagination, message = 'Success') => {
    return res.status(200).json({
        success: true,
        message,
        data,
        pagination,
    });
};
