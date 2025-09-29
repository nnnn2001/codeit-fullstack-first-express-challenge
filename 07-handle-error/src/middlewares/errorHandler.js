
/**
 * 에러 핸들러 미들웨어 생성
 */

import { HttpException } from "../errors/httpException.js";

// Express가 에러 미들웨어로 인식하려면 4개 인자 필수
export const errorHandler = (error, req, res, _next) => {
  console.error('error message', error);

  //`HttpException`은 HTTP 요청 처리 중 발생하는 예외 상황을 나타내기 위해 만든 사용자 정의 오류 클래스
  if (error instanceof HttpException) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error,'
  });
}