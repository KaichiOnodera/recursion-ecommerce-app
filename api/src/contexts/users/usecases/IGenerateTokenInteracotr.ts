import jwt from "jsonwebtoken";

export interface IGenerateTokenInteractor {
  execute(payload: { id: number; email: string }): string;
}

export class GenerateTokenInteractor implements IGenerateTokenInteractor {
  execute(payload: { id: number; email: string }): string {
    const secret = process.env.JWT_SECRET || "default_secret";
    return jwt.sign(payload, secret, { expiresIn: "1h" });
  }
}