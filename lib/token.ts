import { v4 } from "uuid";
import { getVerificationTokenByEmmail } from "./queries";
import { TokenType } from "@prisma/client";
import { db } from "./db";

export const generateToken = async (email: string, type: TokenType,storeId?:string) => {
  const token = v4();

  const expires = new Date(new Date().getTime() + 60 * 100000);

  const existingToken = await getVerificationTokenByEmmail(email, type);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const newToken = await db.verificationToken.create({
    data: {
      email: email,
      type: type,
      token: token,
      expires: expires,
      storeId:storeId
    },
  });

  return newToken;
};
