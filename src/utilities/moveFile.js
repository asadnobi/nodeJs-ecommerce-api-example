const fs = require('fs');
const path = require('path');

const moveFile = async (file, dir2) => {
  try {
    //gets file name and adds it to dir2
    const sourceFile = path.basename(file);
    const destinationFolder = path.resolve(dir2);
    if (!fs.existsSync(destinationFolder)){
      fs.mkdirSync(destinationFolder);
    }
    const moveFile = path.resolve(dir2, sourceFile);
    return await new Promise((resolve, reject) => {
      fs.rename(file, moveFile, (err) => {
        if(err) return resolve(false);
        return resolve(true);
      });
    });
  } catch (err) {
    return err;
  }
}

module.exports = moveFile;