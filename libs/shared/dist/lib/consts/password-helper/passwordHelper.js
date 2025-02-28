"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordConstraints = void 0;
exports.passwordConstraints = {
    minLength: 4,
    maxLength: 64,
    pattern: /^(?=[^A-Z\n]*[A-Z])(?=[^a-z\n]*[a-z])(?=[^0-9\n]*[0-9])(?=[^#?!@$%^&*\-()\n]*[#?!@$%^&*()-]).\S{4,64}$/,
};
//# sourceMappingURL=passwordHelper.js.map