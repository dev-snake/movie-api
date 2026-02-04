/**
 * Jest Setup File
 * Cấu hình môi trường test
 */

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';

// Tăng timeout cho async tests
jest.setTimeout(30000);

// Mock console.log trong tests để giảm noise
// global.console = {
//     ...console,
//     log: jest.fn(),
//     debug: jest.fn(),
//     info: jest.fn(),
// };
