"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 8081;
app_1.default.get('/', (req, res) => {
    res.send('Welcome to TS To-do List API');
});
app_1.default.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
