import { ApiError } from "./errors.js";
import jwt from "jsonwebtoken";
import {findPublic} from "./users.js";
const key = process.env.JWT_SECRET;
if(!/^[0-9a-fA-F]{64}$/.test(key)) {
  throw new Error("형식이 다름");
}
const new_key = Buffer.from(key, 'hex');
const ISSUER = process.env.JWT_ISSUER || "webservice-class";
const AUDIENCE = process.env.JWT_AUDIENCE || "board-api"; 
const TTL = Number(process.env.TOKEN_TTL || 90);
export function issueToken(user) {
  return jwt.sign({}, new_key, {algorithm: "HS256", subject: String(user.id), issuer: ISSUER, audience: AUDIENCE, expiresIn: TTL})

}
export function currentUserId(req) {
  const header = req.headers.authorization;
  if(!header|| header.slice(0, 7) !== "Bearer ") {
    throw new ApiError(401, "TOKEN_REQUIRED", "로그인 필요")
  }

  const token = header.slice(7);
  if (!token) {
    throw new ApiError(401, "TOKEN_REQUIRED", "로그인 필요")
  }

  let payload;
  try {
    payload = jwt.verify(token, new_key, {algorithms: ["HS256"], issuer: ISSUER, audience: AUDIENCE});
  } catch (e) {
    if(e.name == "TokenExpiredError") {
      throw new ApiError(401, "TOKEN_EXPIRED", "로그인 시간 만료");
    }
    else {
      throw new ApiError(401, "INVALID_TOKEN", "인증 정보가 올바르지 않음");
    }
  }

  if(typeof payload.exp !=="number") {
    throw new ApiError(401, "INVALID_TOKEN", "인증 정보가 올바르지 않음");
  }

  const id = Number(payload.sub);
  if (!Number.isInteger(id)) {
    throw new ApiError(401, "INVALID_TOKEN", "인증 정보가 올바르지 않음");
  }

  if(!findPublic(id)) {
    throw new ApiError(401, "INVALID_TOKEN", "인증 정보가 올바르지 않음");
  }
  
  return id;
}
export function assertOwner(userId, authorId) {
  if(userId !== authorId){
    throw new ApiError(403, "FORBIDDEN", "본인이 작성한 글만 수정·삭제할 수 있음");
  }
}
