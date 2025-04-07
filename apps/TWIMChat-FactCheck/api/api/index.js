"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
// Simple redirect to status endpoint
function handler(req, res) {
    res.setHeader('Location', '/api/status');
    res.status(302).end();
}
//# sourceMappingURL=index.js.map