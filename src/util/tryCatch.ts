export const tryCatch = (cb: any) => {
  try {
    cb();
  } catch (error) {
    console.log(error);
  }
};