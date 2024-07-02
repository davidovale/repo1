const errorController = {};

// Controller function for an intentional error
errorController.startError = (req, res, next) => {
    try {
        nonExistentFunction();
    } catch (error) {
        next(error);
        // next(JSON.stringify(error.message))
    }
};

module.exports = errorController;