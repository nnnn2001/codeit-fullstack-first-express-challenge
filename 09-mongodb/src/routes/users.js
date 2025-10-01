import express from 'express';
import { validateUser } from '../middlewares/validateUser.js';
import { BadRequestException } from '../errors/badRequestException.js';
import { NotFoundException } from '../errors/notFoundException.js';
import { ConflictException } from '../errors/conflictException.js';
import { User } from '../models/user.model.js';

export const userRouter = express.Router();


// GET /users - 모든 사용자 조회
userRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    next(error);
  }

});

// GET /users/:id - 특정 사용자 조회
userRouter.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// POST /users - 새 사용자 생성
userRouter.post('/', validateUser, async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictException('중복된 이메일입니다.');
    }

    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json({
      success: true,
      data: newUser,
      message: '사용자가 생성되었습니다',
    });
  } catch (error) {
    next(error);
  }
});

// PUT /users/:id - 사용자 정보 업데이트
/** validateUser 미들웨어가 먼저 실행되어 요청한 사용자 데이터가 형식적으로 유효한지 검증한다.
 * 요청 본문(req.body)에서 'name','email'을 받고, URL 파라미터에서 'userId'를 추출한다.
 *  */
userRouter.patch('/:id', validateUser, async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const { id: userId } = req.params;
    /**
     * user.findOne 을 사용해 같은 이메일을 가진 사용자가 있는지 검색한다.
     * 만약 이미 존재한다면 중복 이메일이므로 ConflictException 409에러를 던진다.
     */
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      throw new ConflictException('중복된 이메일입니다.');
    }
    /**
     * user.findByIdAndUpdate 로 사용자 id에 해당하는 문서를 찾아 이름과 이메일을 업데이트한다.
     * 옵션 { new: true } 는 업데이트된 최종 문서를 반환한다.
     */
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    res.json({
      success: true,
      data: updatedUser,
      message: '사용자가 수정되었습니다',
    });

  } catch (error) {
    next(error);
  }
});

// DELETE /users/:id - 사용자 삭제

/** 
 * 메모리에 있는 배열에서 직접 삭제하는 방식
 * if (userIndex === -1) { throw new NotFoundException('사용자를 찾을 수 없습니다'); }
 * 이 코드는 배열 내에서 삭제하려는 사용자의 인덱스를 찾아서, 없으면 예외를 던지고, 있으면 배열에서 해당 인덱스의 요소를 삭제
 * DB에서 직접 삭제하는 명령
 * const deletedUser = await User.findByIdAndDelete(req.params.id); 
 * if (!deletedUser) { throw new NotFoundException('사용자를 찾을 수 없습니다');}
 * 이 코드는 MongoDB에서 '_id'가 'req.params.id'인 문서를 찾아 삭제. 삭제된 문서가 없으면 예외를 던짐 */
userRouter.delete('/:id', async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다');
    }
    res.json({
      success: true,
      message: '사용자가 삭제되었습니다'
    });
  } catch (error) {
    next(error);
  }
});

// GET /users/:userId/posts/:postId - 중첩 리소스
userRouter.get('/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.json({ userId, postId });
});
