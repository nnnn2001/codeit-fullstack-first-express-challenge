/**
 * 환경변수를 검증하고 설정하는 파일
 * 프로그램이 실행되기 전에 중요한 설정 값들이 올바른 형식과 값인지 검사해서 문제가 있으면 미리 알려주고 종료시키는 역할
 */

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().min(1000).max(65535),
});

const parseEnvironment = () => {
  try {
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
    });
  } catch (error) {
    if (error instanceof z.zodError) {
      console.log('error.errors', error);
    }
    process.exit(1);
  }
};

export const config = parseEnvironment();

//환경별 헬퍼 함수들
export const isDevelopment = () => config.NODE_ENV === 'development';
export const isProduction = () => config.NODE_ENV === 'production';
export const isTest = () => config.NODE_ENV === 'test';



