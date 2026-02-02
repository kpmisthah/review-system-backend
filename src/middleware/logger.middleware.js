const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;

    console.log(`[${timestamp}] ${method} ${url}`);

    // Calculate response time
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${timestamp}] ${method} ${url} ${res.statusCode} ${duration}ms`);
    });

    next();
};

export default logger;
