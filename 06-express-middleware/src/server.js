import express from 'express';
import { router } from './routes/index.js';
import { logger } from './middlewares/logger.js';
import { requestTimer } from './middlewares/requestTimer.js';
import { cors } from './middlewares/cors.js';




const app = express();
const PORT = 5001;

// JSON 파싱 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors);
app.use(logger);
app.use(requestTimer);

//URL 인코딩 파싱 for req.body 인식
app.use(express.urlencoded({
  extended:
    true
}));

//정적 파일 제공
app.use(express.static('public'));

// 모든 라우트 등록
app.use('/', router);

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
