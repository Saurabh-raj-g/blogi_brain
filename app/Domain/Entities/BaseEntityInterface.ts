type BaseEntityInterface = {
    /**
     * convert entity to json for models.
     * Timestamp fields should stay as DateTime type, not convert to String.
     */
    toJsonForModel(): { [key: string]: any };
};
