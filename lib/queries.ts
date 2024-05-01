"use server";

import { auth } from "@/auth";
import { db } from "./db";
import * as z from "zod";
import { StaffSchema, StoreDetailsSchema, TeamInviteShcema } from "@/schema";
import { UTApi } from "uploadthing/server";
import nodeMailer, { Transporter } from "nodemailer";
import { TokenType } from "@prisma/client";
import { generateToken } from "./token";
import pageUrl from "./config";

const utapi = new UTApi();

export const getAuthUserDetail = async () => {
  try {
    const session = await auth();
    const user = session?.user;
    console.log(user);
    if (!user) {
      return null;
    }

    const userData = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    return userData;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getStoreStaff = async (userId: string, storeId: string) => {
  try {
    const role = await db.userToStore.findFirst({
      where: {
        AND: [{ userId }, { storeId }],
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    if (!role) return null;

    return role;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getStoreStaffs = async (storeId: string) => {
  try {
    const roles = await db.userToStore.findMany({
      where: {
        storeId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    if (!roles) return [];

    return roles;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const saveActivityLogsNotification = async ({
  storeId,
  description,
  link,
}: {
  storeId?: string;
  description: string;
  link?: string;
}) => {
  if (!storeId) {
    console.log("no storeId");
    return null;
  }
  try {
    const user = await getAuthUserDetail();

    if (!user) {
      console.log("un auth");
      return null;
    }

    const staff = await getStoreStaff(user.id, storeId);

    if (!staff) {
      console.log("cant not find staff");
      return null;
    }

    const newNoti = await db.notification.create({
      data: {
        notification: description,
        staffId: staff.id,
        storeId: storeId,
        link: link,
      },
    });

    return newNoti;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const insertStore = async (
  values: z.infer<typeof StoreDetailsSchema>
) => {
  try {
    const user = await getAuthUserDetail();
    if (!user) {
      console.log("un auth");
      return null;
    }

    const validatedFields = StoreDetailsSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!!!!" };
    }
    const {
      name,
      storeEmail,
      storeLogo,
      storePhone,
      whiteLabel,
      address,
      country,
      city,
      state,
      zipCode,
    } = validatedFields.data;

    const newStore = await db.store.create({
      data: {
        name,
        storeEmail,
        storeLogo,
        storePhone,
        whiteLabel,
        address,
        country,
        city,
        state,
        zipCode,
      },
    });

    if (newStore) {
      await db.userToStore.create({
        data: {
          name: user.name,
          image: user.image,
          userId: user.id,
          storeId: newStore.id,
          role: "STORE_OWNER",
        },
      });

      if (storeLogo) {
        await db.media.update({
          where: {
            link: storeLogo,
          },
          data: {
            storeId: newStore.id,
            userId: user.id,
          },
        });
      }
      return newStore;
    } else {
      if (storeLogo) await utapi.deleteFiles([storeLogo]);
    }

    return newStore;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateStore = async (
  values: z.infer<typeof StoreDetailsSchema>
) => {
  try {
    const user = await getAuthUserDetail();
    if (!user) {
      console.log("un auth");
      return null;
    }

    const validatedFields = StoreDetailsSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!!!!" };
    }
    const {
      id,
      name,
      storeEmail,
      storeLogo,
      storePhone,
      whiteLabel,
      address,
      country,
      city,
      state,
      zipCode,
    } = validatedFields.data;

    if (!id) {
      return null;
    }

    const exsitingStore = await db.store.findFirst({
      where: {
        id: id,
      },
    });

    if (!exsitingStore) {
      console.log("no es");
      return null;
    }

    const updatedStore = await db.store.update({
      where: {
        id: id,
      },
      data: {
        name,
        storeEmail,
        storeLogo,
        storePhone,
        whiteLabel,
        address,
        country,
        city,
        state,
        zipCode,
      },
    });

    if (updatedStore) {
      if (
        exsitingStore.storeLogo &&
        storeLogo &&
        exsitingStore.storeLogo !== storeLogo
      ) {
        await db.media.update({
          where: {
            link: exsitingStore.storeLogo,
          },
          data: {
            link: storeLogo,
            userId: user.id,
          },
        });

        await utapi.deleteFiles([exsitingStore.storeLogo]);
      }
      return updateStore;
    } else {
      if (storeLogo) await utapi.deleteFiles([storeLogo]);
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getStoreById = async (storeId: string) => {
  try {
    const store = await db.store.findFirst({
      where: {
        id: storeId,
      },
    });

    return store;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getNotificationAndUser = async (storeId: string) => {
  try {
    const response = await db.notification.findMany({
      where: { storeId },
      include: {
        staff: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const deleteStore = async (storeId: string) => {
  const response = await db.store.delete({ where: { id: storeId } });
  return response;
};

export const deleteUser = async (userId: string) => {
  try {
    const user = await getAuthUserDetail();
    if (!user) return null;

    const deletedUser = await db.user.delete({ where: { id: userId } });

    return deletedUser;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAuthUserStoreStaff = async (storeId: string) => {
  try {
    const session = await auth();
    if (!session?.user || !session.user.id) return null;

    const user = await getStoreStaff(session.user.id, storeId);

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

interface EmailOption {
  email: string;
  subject: string;
  name: string;
  confirmLink: string;
}

export const sendMail = async (options: EmailOption) => {
  const transporter: Transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { email, subject, name, confirmLink } = options;

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html: `<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>POS JOIN TEAM</title>
        <style type="text/css">
            /* Base  */
    
            body {
                margin: 0;
                padding: 0;
                min-width: 100%;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.5;
                background-color: #FAFAFA;
                color: #222222;
            }
            a{
                color: #000;
                text-decoration: none;
            }
            h1{
                font-size: 24px;
                font-weight: 700;
                line-height: 1.25;
                margin-top: 0;
                margin-bottom: 15px;
                text-align: center;
            }
            p{
                margin-top: 0;
                margin-bottom: 24px;
            }
            table td{
                vertical-align: top;
            }
            /* Layout */
            .email-wrapper  {
                max-width: 600;
                margin: 0 auto;
            }
            .email-header {
                background-color: #0080f3;
                padding: 24px;
                color: #ffffff;
            }
            .email-body {
                padding: 24px;
                background-color: #ffffff;
            }
            .email-footer {
                padding: 24px;
                background-color: #f6f6f6;
            }
            /* Button  */
    
            .button {
                display: inline-block;
                background-color: #0070f3;
                color: #ffffff;
                font-size: 16px;
                font-weight: 700;
                text-align: center;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 4px;
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="email-header">
                <h1>POS</h1>
            </div>
            <div class="email-body">
                <p>Hello ${name}</p>
                <h2>LOGGIN TO THE INVITED ACCOUNT BEFORE CLICKING THE INVITATION LINK</h2>
                <p>To ${subject.toLowerCase()}, please use the following confirmation link</p>
                <h2>${confirmLink}</h2>
                <p>Please confirm this link within 1 hour</p>
            </div>
            <div class="email-footer">
                <p>If you have any question, please dont hestiate to contact us at <a href="mailto:khoinguyenviet1807@gmail.com">support mail</a></p>
            </div>
        </div>
    </body>
    </html>`,
  };

  await transporter.sendMail(mailOptions);
};

export const getVerificationTokenByToken = async (
  token: string,
  type: TokenType
) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        token: token,
        type: type,
      },
    });
    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmmail = async (
  email: string,
  type: TokenType
) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        email: email,
        type: type,
      },
    });
    return verificationToken;
  } catch {
    return null;
  }
};

export const sendTeamInvite = async (
  values: z.infer<typeof TeamInviteShcema>,
  storeId: string
) => {
  try {
    const currentStaff = await getAuthUserStoreStaff(storeId);

    if (!currentStaff || currentStaff.role === "STORE_STAFF") {
      return {
        message: "unauthorized",
        data: null,
        status: false,
      };
    }

    const validatedFields = TeamInviteShcema.safeParse(values);
    if (!validatedFields.success) {
      return {
        message: "invalid fields",
        data: null,
        status: false,
      };
    }

    const { email, role } = validatedFields.data;

    const user = await db.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return {
        message: "User does not exists",
        data: null,
        status: false,
      };
    }

    const existingUserRole = await db.userToStore.findFirst({
      where: {
        storeId: storeId,
        userId: user.id,
      },
    });

    if (existingUserRole) {
      return {
        message: "User is already a member of this store",
        data: null,
        status: false,
      };
    }

    const existingToken = await getVerificationTokenByEmmail(
      email,
      "TEAM_INVITE"
    );

    if (existingToken) {
      await db.verificationToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }

    const verificationToken = await generateToken(
      email,
      "TEAM_INVITE",
      storeId
    );

    await sendMail({
      email: email,
      subject: "ACCEPT INVITATION",
      name: email,
      confirmLink: `${pageUrl}/new-verification?token=${verificationToken.token}&type=TEAM_INVITE`,
    });

    return {
      data: null,
      message: "An invitation has been send",
      status: true,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      message: error,
      status: false,
    };
  }
};

export const acceptTeamInvite = async (token: string) => {
  try {
    const user = await getAuthUserDetail();
    if (!user) {
      return {
        data: null,
        message: "unauthenticated",
        status: false,
      };
    }

    const existingToken = await getVerificationTokenByToken(
      token,
      "TEAM_INVITE"
    );

    if (!existingToken) {
      return {
        data: null,
        message: "Token does not exist",
        status: false,
      };
    }

    const existingStaff = await getStoreStaff(user.id, existingToken.id);

    if (existingStaff) {
      return {
        data: null,
        message: "User is already a member of this store",
        status: false,
      };
    }

    if (!existingToken.storeId) {
      return {
        data: null,
        message: "Invalid token",
        status: false,
      };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return {
        data: null,
        message: "Token has expired!",
        status: false,
      };
    }

    if (user.email !== existingToken.email) {
      return {
        data: null,
        message: "Invalid Invitation",
        status: false,
      };
    }

    await db.userToStore.create({
      data: {
        name: user.name,
        image: user.image,
        userId: user.id,
        storeId: existingToken.storeId,
      },
    });

    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });

    return {
      data: null,
      message: "Store Access Granted",
      status: true,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      message: "Could not accept invataion!",
      status: false,
    };
  }
};

export const updateStaff = async (
  values: z.infer<typeof StaffSchema>,
  storeId: string
) => {
  try {
    const validatedFields = StaffSchema.safeParse(values);
    if (!validatedFields.success) {
      return {
        message: "invalid fields",
        data: null,
        status: false,
      };
    }
    const { id, name, image, role, phone } = validatedFields.data;
    const currentStaff = await getAuthUserStoreStaff(storeId);
    if (!currentStaff) {
      return {
        data: null,
        message: "unauthorised",
        status: false,
      };
    }

    if (currentStaff.role === "STORE_STAFF") {
      return {
        data: null,
        message: "unauthorised",
        status: false,
      };
    }

    const updatedStaff = await db.userToStore.update({
      where: {
        id: id,
      },
      data: {
        name,
        phone,
        image,
        role,
      },
    });

    if (updatedStaff) {
      return {
        data: updatedStaff,
        message: "updated",
        status: true,
      };
    }
    return {
      data: null,
      message: "something went wrong",
      status: false,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      message: "something went wrong",
      status: false,
    };
  }
};
