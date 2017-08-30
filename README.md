# Codekit Atom Sync

Automatically switch between projects in CodeKit

CodeKit Atom Sync Plugin for Atom keeps CodeKit in sync with your interactions in Atom.

___

### Under the hood

Anytime you open a directory in Atom, this plugin looks for a CodeKit config file. If one is found, the plugin will switch to that project in CodeKit.

If no config file is found, nothing will happen.

___

### Features

With CodeKit Atom Sync you can control CodeKit in a variety of ways with simple Atom commands:

- Add your current Atom working folder to CodeKit: `add-project-to-codekit`
- Launch CodeKit: `open-codekit`
- Open the CodeKit preview server: `open-codekit-preview-server`

Additionally, you can temporarily pause CodeKit Atom Sync with the command:

`toggle-codekit-atom-sync`

This is useful when you want to have multiple project windows open at once.


You can add your current project to CodeKit by selecting `Packages > CodeKit Atom Sync > Add Project To CodeKit`

___

### Bugs / Issues

If you encounter any issues please [let me know here](https://github.com/treetrum/codekit-atom-sync/issues) or create a pull request with a fix.

___

### License

The plugin and this source code are released under the MIT License.