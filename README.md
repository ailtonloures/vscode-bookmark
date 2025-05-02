<div align="center">
 <h1>
<br/>
  <img src="./public/icons/build/icon.png" alt="VSCode Bookmark" width="120">
<br/>
<br/>
VSCode Bookmark

![GitHub Release](https://img.shields.io/github/v/release/ailtonloures/vscode-bookmark)
![GitHub License](https://img.shields.io/github/license/ailtonloures/vscode-bookmark)
</h1>

<p>A utility to save your favorite projects and files to open them easily on Visual Studio Code.</p>

</div>

## Features

- Save projects and files to open in vscode;
  - WSL integration;
  - add by drag and drop;
  - add by file's browser;
- Open bookmarks config to edit order and basename;
- Auto update;

## Downloads

- [Windows](https://github.com/ailtonloures/vscode-bookmark/releases/download/v1.0.0/VSCode.Bookmark-1.0.0.Setup.exe)
- [MacOs](https://github.com/ailtonloures/vscode-bookmark/releases/download/v1.0.0/VSCode.Bookmark-darwin-arm64-1.0.0.zip)
- [Linux](https://github.com/ailtonloures/vscode-bookmark/releases/download/v1.0.0/vscode-bookmark_1.0.0_amd64.deb)

[View all platforms...](https://github.com/ailtonloures/vscode-bookmark/releases/latest)

## Development

### Requirements

- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)
- [Node.js LTS](https://nodejs.org/pt)

### How to use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer.

```bash
# Clone this repository
$ git clone https://github.com/ailtonloures/vscode-bookmark

# Go into the repository
$ cd vscode-bookmark

# Install dependencies
$ npm install

# Run the app
$ npm start
```

### Build

After installing all dependencies,  you need to run the `make` command to build the project.

```bash
# Go into the repository
$ cd vscode-bookmark

# Run the make command
$ npm run make
```

### Credits

This software uses the following open source packages:

- [Electron](https://www.electronjs.org/)
- [Electron Forge](https://www.electronforge.io/)
- [Electron Store](https://github.com/sindresorhus/electron-store#readme)
- [Node.js](https://nodejs.org/)
- [ESlint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Sentry](https://sentry.io/)
- [Vite](https://vite.dev/)
- [Husky](https://github.com/typicode/husky)
- [Update Electron App](https://github.com/electron/update-electron-app)

## Contributing

Contributions are always welcome, consider opening an issue first and discuss with the community before opening a pull request.

Check out the [CONTRIBUTING.md](./CONTRIBUTING.md).
