let data = { agents: [], offenses: [] };

module.exports = {
  getData() {
    return data;
  },
  setData(newData) {
    data = newData;
  }
};
