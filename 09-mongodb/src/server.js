import express from 'express';
import { router } from './routes/index.js';
import { logger } from './middlewares/logger.js';
import { requestTimer } from './middlewares/requestTImer.js';
import { cors } from './middlewares/cors.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { config, isDevelopment } from './config/config.js';
import { connectDB, disconnectDB } from './db/index.js';

const app = express();
connectDB(); // DB연결

// JSON 파싱 미들웨어
app.use(express.json());
// URL 인코딩 파싱
app.use(express.urlencoded({ extended: true }));
// cors
app.use(cors);

// 범용 미들웨어
if (isDevelopment()) {
  app.use(logger);
  app.use(requestTimer);
}

// 모든 라우트 등록
app.use('/', router);

// 정적 파일 제공
app.use(express.static('public'));

// 에러 핸들링
app.use(errorHandler);

// 서버 시작
const server = app.listen(config.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${config.PORT}`);
});

/**
 * Graceful Shutdown
 * 서버가 종료될 때 바로 끊기지 않고 현재 처리 중인 일을 마무하고 안전하게 종료할 수 있게 돕는 역할 
 * \
 * 왜 필요한가? - 서버가 갑작스럽게 종료되면, 현재 처리중인 클라이언트 요청이 중단되어 데이터 손실, 오류, 불완전한 상태를 만들 수 있음
 * 그레이스풀 셧다운은 이런 문제를 막고, 현재 작업을 마친 후 안전하게 서버와 DB 연결등을 정리하며 종료하도록 함
 * 
 * 이 코드는 서버를 부드럽게 종료시켜 안정성과 신뢰성을 높여주는 중요 기능*/
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    disconnectDB();
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));


