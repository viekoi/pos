"use server";

import { auth } from "@/auth";
import { db } from "./db";
import * as z from "zod";
import { StoreDetailsSchema } from "@/schema";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export const getAuthUserDetail = async () => {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return null;
  }

  const userData = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  return userData;
};

export const getUserStoreRole = async (userId: string, storeId: string) => {
  try {
    const role = await db.userToStore.findFirst({
      where: {
        AND: [{ userId }, { storeId: storeId }],
      },
    });

    return role;
  } catch (error) {
    console.log(error);
    return null;
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
    return;
  }

  const user = await getAuthUserDetail();

  if (!user) {
    console.log("un auth");
    return null;
  }
  await db.notification.create({
    data: {
      notification: description,
      userId: user.id,
      storeId: storeId,
      link: link,
    },
  });
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
      goal,
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
        goal,
      },
    });

    if (newStore) {
      await db.userToStore.create({
        data: {
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
      goal,
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
        goal,
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
      include: { User: true },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return response
  } catch (error) {
    console.log(error)
  }
}