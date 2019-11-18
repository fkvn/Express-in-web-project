const fs = require('fs')

const util = require('util');



// convert fs.readFile async function to promise by using util.promisify
const readFile = util.promisify(fs.readFile);

const writeFile = util.promisify(fs.writeFile);

class FeedbackService {
  constructor(datafile) {
    this.datafile = datafile;
  }

  async addEntry(name, title, message) {
    const data = await this.getData();

    data.unshift({name, title, message});
    return writeFile(this.datafile, JSON.stringify(data));
  }

  async getList() {
    const data = await this.getData();
    return data;
  }

  async getData() {
    const data = await readFile(this.datafile, "utf8");

    if (!data) return [];
    
    // parese json to object
    return JSON.parse(data);
  }
}

module.exports = FeedbackService;