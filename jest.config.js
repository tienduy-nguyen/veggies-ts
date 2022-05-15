module.exports = {
    testEnvironment: 'node',
    clearMocks: true,
    moduleFileExtensions: ['js', 'ts'],
    testMatch: ['**/tests/unit/**/*.test.[jt]s'],
    transform: {
        '^.+\\.(t|j)s$': '@swc/jest',
    },
    modulePathIgnorePatterns: ['<rootDir>/build'],
    collectCoverageFrom: ['src/**/*.ts'],
    coverageDirectory: './coverage',
}
