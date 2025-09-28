import express from 'express';

const app = express();
const PORT = 3000;

// JSON 파싱 미들웨어
app.use(express.json());

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: 'Hello Express!',
    timestamp: new Date().toISOString()
  });
});

// GET 라우트 

app.get('/users', (req, res) => {
  res.json({ users: [] });
});

//POST 라우트 (사용자 생성)

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  res.json({ message: '사용자 생성됨', name, email })
});

// PUT 라우트 (사용자 정보 업데이트)
app.put('/users/:id', (req, res) => {
  res.json({ message: `사용자 ${req.params.id} 업데이트` })
});

//DELETE 라우트 (사용자 삭제)
app.delete('/users/:id', (req, res) => {
  res.json({ message: `사용자 ${req.params.id} 삭제` })
});

//URL 매개 변수 (특정 사용자 조회)
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ userId: id });
})

//쿼리 문자열 (검색 기능)
app.get('/search', (req, res) => {
  const { q, limit = 10 } = req.query;
  res.json({ query: q, limit: Number(limit) });
});

//여러 매개 변수
app.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.json({ userId, postId });
});


// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});