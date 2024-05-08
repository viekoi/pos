"use server";

import { auth } from "@/auth";
import { db } from "./db";
import * as z from "zod";
import {
  CustomerDetailSchema,
  StoreDetailsSchema,
  MediaSchema,
  CategorySchema,
  BrandSchema,
  ProductSchema,
} from "@/schema";
import { UTApi } from "uploadthing/server";

import { v4 } from "uuid";
import { compareArraysOfObjects } from "./utils";

const utapi = new UTApi();

export const getAuthUserDetail = async () => {
  const session = await auth();
  try {
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
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getStore = async () => {
  const user = await getAuthUserDetail();
  try {
    if (!user) return null;
    const store = await db.store.findFirst({
      where: {
        userId: user.id,
      },
    });

    return store;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const upsertStore = async (
  values: z.infer<typeof StoreDetailsSchema>,
  storeId?: string
) => {
  try {
    const validatedFields = StoreDetailsSchema.safeParse(values);

    if (!validatedFields.success) {
      return null;
    }

    const {
      name,
      storeEmail,
      storeLogo,
      storePhone,
      address,
      country,
      city,
      state,
      zipCode,
    } = validatedFields.data;

    const user = await getAuthUserDetail();
    if (!user) {
      console.log("un auth");
      return null;
    }

    if (storeId) {
      const currentStore = await getStore();
      if (!currentStore) return null;

      if (storeLogo) {
        await db.media.update({
          where: {
            imageUrl: storeLogo,
          },
          data: {
            storeId: currentStore.id,
          },
        });
      }

      const updatedStore = await db.store.update({
        where: {
          id: currentStore.id,
        },
        data: {
          name,
          storeEmail,
          storeLogo,
          storePhone,
          address,
          country,
          city,
          state,
          zipCode,
        },
      });

      return updatedStore;
    }

    const newStore = await db.store.create({
      data: {
        name,
        storeEmail,
        storeLogo,
        storePhone,
        address,
        country,
        city,
        state,
        zipCode,
        userId: user.id,
      },
    });

    if (newStore && storeLogo) {
      await db.media.update({
        where: {
          imageUrl: storeLogo,
        },
        data: {
          storeId: newStore.id,
        },
      });
    }

    return newStore;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteStore = async () => {
  try {
    const currentStore = await getStore();
    if (!currentStore) return null;
    const response = await db.store.delete({ where: { id: currentStore.id } });
    return response;
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
        user: true,
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

export const upsertCustomer = async (
  values: z.infer<typeof CustomerDetailSchema>,
  customerId?: string
) => {
  try {
    const validatedFields = CustomerDetailSchema.safeParse(values);

    if (!validatedFields.success) {
      return null;
    }

    const { address, city, country, name, email, phone } = validatedFields.data;

    const store = await getStore();

    if (!store) return null;

    const customer = await db.customer.upsert({
      where: {
        id: customerId || v4(),
      },
      update: {
        address,
        city,
        country,
        name,
        email,
        phone,
        storeId: store.id,
      },
      create: {
        address,
        city,
        country,
        name,
        email,
        phone,
        storeId: store.id,
      },
    });

    return customer;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const upsertMedia = async (values: z.infer<typeof MediaSchema>) => {
  try {
    const validatedFields = MediaSchema.safeParse(values);

    if (!validatedFields.success) {
      return null;
    }

    const { imageUrl, name } = validatedFields.data;

    const store = await getStore();

    if (!store) return null;

    const media = await db.media.update({
      where: {
        imageUrl,
      },
      data: {
        name: name,
        storeId: store.id,
      },
    });

    console.log(media);
    return media;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const saveActivityLogsNotification = async ({
  description,
  link,
}: {
  description: string;
  link?: string;
}) => {
  try {
    const user = await getAuthUserDetail();
    if (!user) return null;
    const store = await getStore();

    if (!store) return null;

    const newNoti = await db.notification.create({
      data: {
        notification: description,
        storeId: store.id,
        userId: user.id,
        link: link,
      },
    });

    return newNoti;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteMedias = async (imageKeys: string[]) => {
  try {
    const store = await getStore();

    if (!store) return null;
    const deletedFiles = await utapi.deleteFiles(imageKeys);
    if (deletedFiles.success) {
      const medias = await db.media.deleteMany({
        where: {
          key: {
            in: imageKeys,
          },
        },
      });

      return medias;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const upsertCategory = async (
  values: z.infer<typeof CategorySchema>,
  categoryId?: string
) => {
  try {
    const validatedFields = CategorySchema.safeParse(values);

    if (!validatedFields.success) {
      return null;
    }

    const { imageUrl, name, description } = validatedFields.data;
    const store = await getStore();

    if (!store) return null;

    if (imageUrl) {
      await db.media.update({
        where: {
          imageUrl: imageUrl,
        },
        data: {
          storeId: store.id,
        },
      });
    }

    const category = await db.category.upsert({
      where: {
        id: categoryId || v4(),
      },
      update: {
        imageUrl,
        name,
        description,
      },
      create: {
        imageUrl,
        name,
        description,
        storeId: store.id,
      },
    });

    return category;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    const store = await getStore();

    if (!store) return null;

    const category = await db.category.delete({
      where: {
        id: categoryId,
      },
    });

    return category;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const upsertBrand = async (
  values: z.infer<typeof BrandSchema>,
  brandId?: string
) => {
  try {
    const validatedFields = BrandSchema.safeParse(values);

    if (!validatedFields.success) {
      return null;
    }

    const { imageUrl, name, description } = validatedFields.data;
    const store = await getStore();

    if (!store) return null;

    if (imageUrl) {
      await db.media.update({
        where: {
          imageUrl: imageUrl,
        },
        data: {
          storeId: store.id,
        },
      });
    }

    const brand = await db.brand.upsert({
      where: {
        id: brandId || v4(),
      },
      update: {
        imageUrl,
        name,
        description,
      },
      create: {
        imageUrl,
        name,
        description,
        storeId: store.id,
      },
    });

    return brand;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteBrand = async (brandId: string) => {
  try {
    const store = await getStore();

    if (!store) return null;

    const brand = await db.brand.delete({
      where: {
        id: brandId,
      },
    });

    return brand;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const upsertProduct = async (
  values: z.infer<typeof ProductSchema>,
  productId?: string
) => {
  try {
    const validatedFields = ProductSchema.safeParse(values);

    if (!validatedFields.success) {
      return null;
    }

    const {
      basePrice,
      brands,
      categories,
      description,
      discountPrice,
      imageUrl,
      isDiscounting,
      name,
    } = validatedFields.data;
    const store = await getStore();
    if (!store) return null;

    if (imageUrl) {
      await db.media.update({
        where: {
          imageUrl: imageUrl,
        },
        data: {
          storeId: store.id,
        },
      });
    }

    if (!productId) {
      const product = await db.product.create({
        data: {
          basePrice,
          description,
          discountPrice,
          imageUrl,
          isDiscounting,
          name,
          categories: {
            connect: categories.map((c) => ({ id: c.id })),
          },
          brands: {
            connect: brands.map((b) => ({ id: b.id })),
          },
          storeId: store.id,
        },
      });

      return product;
    } else {
      const existingProduct = await db.product.findFirst({
        where: {
          id: productId,
        },
        include: {
          brands: {
            select: {
              id: true,
              name: true,
            },
          },
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!existingProduct) return null;

      const { addedEntries: addedBrands, removedEntries: removedBrands } =
        compareArraysOfObjects(existingProduct.brands, brands);

      const {
        addedEntries: addedCategories,
        removedEntries: removedCategories,
      } = compareArraysOfObjects(existingProduct.categories, categories);

      const product = await db.product.update({
        where: {
          id: productId,
        },
        data: {
          basePrice,
          description,
          discountPrice,
          imageUrl,
          isDiscounting,
          name,
          categories: {
            connect: addedCategories.map((c) => ({ id: c.id })),
            disconnect: removedCategories.map((c) => ({ id: c.id })),
          },
          brands: {
            connect: addedBrands.map((b) => ({ id: b.id })),
            disconnect: removedBrands.map((c) => ({ id: c.id })),
          },
        },
      });
      return product;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const store = await getStore();
    if (!store) return null;

    const product = await db.product.delete({
      where: {
        id: productId,
      },
    });

    return product;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteCustomer = async (cusomterId: string) => {
  try {
    const store = await getStore();

    if (!store) return null;

    const customer = await db.customer.delete({
      where: {
        id: cusomterId,
      },
    });

    return customer;
  } catch (error) {
    console.log(error);
    return null;
  }
};
