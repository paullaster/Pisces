export const  ApiResponder = (req, res, next) => {
    res.ApiResponse = {
        success(data = {}, statusCode = 200, message = 'Success') {
            try {
                res.status(statusCode).json({ message, data });
            } catch (error) {
                return this.error(error, error.message, 500);
            }
        },
        error(statusCode = 500, message = "Error", data = {}) {
            console.log(data);
            res.status(statusCode).json({ message, data});
        }

    };
    next();
}