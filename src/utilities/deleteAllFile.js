const fs = require('fs').promises;
const path = require('path');

const deleteAllFile = async (folderPath) => {
  try {
    let files = [];
    files = await fs.readdir(folderPath);
    if(!files.length) return;
    const promises = files.map(e => fs.unlink(path.join(folderPath, e)));
    await Promise.all(promises);
  } catch (err) {
    return err;
  }
}

module.exports = deleteAllFile;