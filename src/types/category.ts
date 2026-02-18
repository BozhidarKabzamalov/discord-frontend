export type CreateCategoryPayload = {
    serverId: number;
    name: string;
};

export type UpdateCategoryPayload = {
    serverId: number;
    categoryId: number;
    name: string;
};

export type DeleteCategoryPayload = {
    serverId: number;
    categoryId: number;
};
