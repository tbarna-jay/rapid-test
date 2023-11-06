import * as fsCommon from "fs";
import * as crypto from "crypto";

class FS {
  private directory: string;
  private contentMap: { [hash: string]: string } = {};

  constructor(directory: string) {
    this.directory = directory;
    this.ensureDirectoryExists(this.directory);
    this.loadContentMap();
  }

  store(filename: string, content: string): void {
    const hash = this.calculateHash(content);
    this.contentMap[filename] = hash;
    fsCommon.writeFileSync(`${this.directory}/${hash}`, content);
    this.saveContentMap();
  }

  get(filename: string): string | undefined {
    const hash = this.contentMap[filename];
    return fsCommon.readFileSync(`${this.directory}/${hash}`, "utf-8");
  }

  private calculateHash(content: string): string {
    const hash = crypto.createHash("md5");
    hash.update(content);
    return hash.digest("hex");
  }

  private loadContentMap(): void {
    try {
      const data = fsCommon.readFileSync(
        `${this.directory}/contentMap.json`,
        "utf-8"
      );
      this.contentMap = JSON.parse(data);
    } catch (error) {
      this.contentMap = {};
    }
  }

  private saveContentMap(): void {
    fsCommon.writeFileSync(
      `${this.directory}/contentMap.json`,
      JSON.stringify(this.contentMap)
    );
  }

  private ensureDirectoryExists(directory: string): void {
    if (!fsCommon.existsSync(directory)) {
      fsCommon.mkdirSync(directory);
    }
  }
}

// // Example usage
const fs = new FS("./topdir");
fs.store("filename1", "a very long string1");
fs.store("filename2", "a very long string1");
fs.store("filename3", "a very long string3");
fs.store("filename2", "a very long string3");

const result1 = fs.get("filename1"); // gets 'a very long string1'
const result2 = fs.get("filename2"); // gets 'a very long string3'
const result3 = fs.get("filename3"); // gets 'a very long string3'

console.log(result1);
console.log(result2);
console.log(result3);
