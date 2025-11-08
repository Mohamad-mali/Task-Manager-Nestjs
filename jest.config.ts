import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/**/*.module.ts',
    '!src/**/*.DTO.ts',
    '!src/**/*.DTO.ts',
    '!src/**/*.entity.ts',
    '!src/config/**',
    '!src/constants/**',
    '!src/Types/**',
    '!src/**/types/**',
    '!src/interceptors/**',
    '!src/**/interceptors/**',
    '!src/auth/**',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};

export default config;
