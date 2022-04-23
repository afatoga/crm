export const isEmptyObject = (obj:object) => {
    if (!obj) return false;
    return Object.keys(obj).length === 0;
  };