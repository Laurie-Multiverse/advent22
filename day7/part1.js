const {readFile} = require('fs').promises;
const path = require('path');

async function solve() {
  // read file into an array of lines
  //
  const contents = await readFile(
    path.join(__dirname, 'input.txt'),
    { encoding: 'utf8' }
    );
  const array = contents.split('\r\n');

   // a "directory" has keys
   //     parent: tree
   //     name: string
   //     dirs: [directory, directory, ... ]
   //     files: [{size, name}]
  const root = {name: 'root', parent: null, dirs: [], files: []};
  let directory = root; // current directory

  // parse the OS session & create the folder representation starting at root
  //
  for (line of array) {
    if (line == "$ cd /") {               
      // tree root
      directory = root;
    } else if (line == "$ cd ..") {       
      // up one level
      directory = directory.parent;
    } else if (line.startsWith("$ cd")) { 
      // down one level to NAME
      const [,,name] = line.split(" ");
      // find the directory with name that was already created
      directory = directory.dirs.find(dir => dir.name == name);
    } else if (line == "$ ls") {
      // list contents (no action required)
    } else if (line.startsWith("dir")) {  
      // add a new directory to the current one
      const [,name] = line.split(" ");
      directory.dirs.push({
        name, parent: directory, dirs: [], files: []
      })
    } else {                              
      // add a new file to the current directory
      let [size, name] = line.split(" ");
      size = Number(size); 
      directory.files.push({size, name});
    }
  }

  // accumulate the total size of all directories <= 100k
  let totalSize = 0;

  // Calculate the sizes of each directory in the tree
  const getSize = (tree) => {
    tree.size = 0;
    for (file of tree.files) {
      tree.size += file.size;
    }
    for (dir of tree.dirs) {
      tree.size += getSize(dir);
    }
    // console.log(dir.name, size);
    if (tree.size <= 100000) {
      totalSize += tree.size;
    }
    return tree.size;
  }

  getSize(root);
  console.log("Answer:", totalSize);
}

solve();
