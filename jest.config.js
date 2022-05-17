module.exports = {
    testEnvironment: 'node',
    clearMocks: true,
    moduleFileExtensions: ['js', 'ts'],
    testMatch: ['**/tests/unit/**/*.test.[jt]s'],
    transform: {
        '^.+\\.(t|j)s$': '@swc/jest',
    },
    modulePathIgnorePatterns: ['<rootDir>/lib'],
    collectCoverageFrom: ['src/**/*.ts'],
    coverageDirectory: './coverage',
}
