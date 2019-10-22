# File Clipper
This package enables you to encrypt or decrypt files or folder with provided secret. so you can deploy you code securly sand safly and even someone got you code he weill not be able to read and execute it.

## How To Install
To install run bwlow command
```bash
npm install -g file-clipper
```

## How To User
```
Usage: file-clipper [options]

Options:
  -V, --version          output the version number
  -m, --mode <mode>      encrypt/decrypt the filea or folders (default: "")
  -p, --path <path>      path of a file or directory (default: "")
  -s, --secret <secret>  secrect or salt to handle encryption (default: "")
  -h, --help             output usage information
```

For encryption
```bash
file-clipper -m encrypt -p test.txt -s mypassword
```

For decryption
```bash
file-clipper -m decrypt -p test.txt -s mypassword
```

## License
MIT
