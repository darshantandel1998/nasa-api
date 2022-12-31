const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

function getPagination(query) {
    const page = Math.max(DEFAULT_PAGE_NUMBER, parseInt(query.page, 10)) || DEFAULT_PAGE_NUMBER;
    const limit = Math.max(DEFAULT_PAGE_LIMIT, parseInt(query.limit, 10)) || DEFAULT_PAGE_LIMIT;
    const skip = (page - 1) * limit;
    return { skip, limit };
}

module.exports = { getPagination };
