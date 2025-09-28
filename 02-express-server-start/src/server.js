import express from 'express';

const app = express();
const PORT = 3000;

// JSON 파싱 미들웨어
/** 미들웨어: 요청이 들어와 응답이 나가기 전 중간 과정에 끼어들어 특정 작업을 처리하는 함수
 * express에서는 app.use()를 사용해 미들웨어를 등록
 * express.json()은 클라이언트가 서버로 전송하는 JSON 데이터를 파싱
 */
app.use(express.json());

//기본 라우트
app.get("/", (req, res) => {
  res.json({
    message: "Hello Express!",
    timestamp: new Date().toISOString(),
  });
});

//서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});