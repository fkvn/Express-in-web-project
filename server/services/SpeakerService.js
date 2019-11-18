const fs = require('fs')

const util = require('util');

// convert fs.readFile async function to promise by using util.promisify
const readFile = util.promisify(fs.readFile);

class SpeakerService {
  constructor(datafile) {
    this.datafile = datafile;
  }

  async getSpeakerbyShortname(shortname) {
    const data = await this.getData();
    const spk = data.filter(speaker => speaker.shortname === shortname)
    return spk[0];
  }

  async getNames() {
    const data = await this.getData();

    return data.map((speaker) => {
      return {name: speaker.name, shortname: speaker.shortname}
    })
  }

  async getListShort() {
    const data = await this.getData();

    return data.map((speaker) => {
      return {name: speaker.name, shortname: speaker.shortname, title: speaker.title}
    })
  }

  async getList() {
    const data = await this.getData();

    return data.map((speaker) => {
      return {
        name: speaker.name, 
        shortname: speaker.shortname, 
        title: speaker.title,
        summary: speaker.summary
      }
    })
  }

  async getAllArtwork() {
    const data = await this.getData();

    const artwork = data.reduce((allArtwork, speaker) => {
      if (speaker.artwork) {
        // concat 2 arrays to 1 array
        allArtwork = [...allArtwork, ...speaker.artwork];

        return allArtwork;
      }
    }, []); // initilize the allArtwork by empty array []

    return artwork;
  }

  async getData() {
    const data = await readFile(this.datafile, "utf8");

    if (!data) return [];
    
    // parese json to object
    return JSON.parse(data).speakers;
  }
}

module.exports = SpeakerService;