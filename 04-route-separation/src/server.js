import express from 'express';
import { router } from './routes/index.js'

const app = express();
const PORT = 3000;

// JSON 파싱 미들웨어
app.use(express.json());

// 모든 라우트 등록
app.use('/', router);


// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
