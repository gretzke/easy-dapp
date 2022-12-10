export const setObject = (obj: any, pathString: string, value: any): typeof obj => {
  const path = pathString.split('.');
  const last = path.pop();
  if (last) {
    const lastObj = path.reduce((acc, cur) => acc[cur], obj);
    lastObj[last] = value;
  }
};
