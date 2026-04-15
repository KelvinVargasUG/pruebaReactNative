const config = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['./jest.setup.ts'],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        'components/ProductCard.tsx',
        'components/SkeletonCard.tsx',
        'components/FormField.tsx',
        'components/DeleteModal.tsx',
        '!**/__tests__/**',
        '!**/*.d.ts',
    ],
    coverageThreshold: {
        global: {
            statements: 70,
            branches: 70,
            functions: 70,
            lines: 70,
        },
    },
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
    ],
};

module.exports = config;
