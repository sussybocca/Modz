self.onmessage = e => {
  const { code } = e.data;
  const fn = new Function("api", code);
  fn({});
};
