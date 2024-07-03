const errorController = {};

// Controller function for intentional error
errorController.startError = (req, res, next) => {
    try {
        nonExistentFunction();
    } catch (error) {
        next(error);
    }
};

module.exports = errorController;