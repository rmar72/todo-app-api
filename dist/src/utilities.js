"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const handleError = (error, res) => {
    if (error instanceof Error) {
        res.status(400).json({ error: error.message });
    }
    else {
        res.status(400).json({ error: 'An unknown error occurred' });
    }
};
exports.handleError = handleError;
