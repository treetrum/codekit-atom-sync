'use babel';

import {CompositeDisposable} from 'atom';

const osascript = require('node-osascript');
const fileExists = require('file-exists');

export default {

    subscriptions : null,

    activate(state) {

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'codekit-atom-sync:open-codekit': () => this.codekit_open(),
            'codekit-atom-sync:add-project-to-codekit': () => this.codekit_addProject()
        }));

        // Add event listener for workspace opening something
        this.subscriptions.add(atom.workspace.onDidOpen( this.atom_environmentChanged.bind(this) ));

    },

    deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.codekitAtomSyncView.destroy();
    },

    serialize() {
        return {};
    },


    /*
    |--------------------------------------------------------------------------
    | Atom Commands
    |--------------------------------------------------------------------------
    */

    // Determines if this folder is a codekit project.
    // If it is - it adds and switches to it in CodeKit
    atom_environmentChanged(event) {

        let path = atom.project.getPaths()[0];

        fileExists(`${path}/config.codekit3`, (err, exists) => {
            
            // Switch/Add project
            if (exists) {
                this.codekit_addProject(path);
                this.codekit_switchProject(path);
            } else {
                // Then this isn't a Codekit Project. Do nothing.
                // console.log("Not switching here... It's not a project");
            }
        });
    },


    /*
    |--------------------------------------------------------------------------
    | Codekit Commands
    |--------------------------------------------------------------------------
    */

    // If Codekit is not running, open it. Do nothing if it's already running.
    codekit_open() {
        osascript.execute(`tell application "CodeKit" to launch`, function(err, result, raw) {});
    },

    // Adds a project to Codekit then switches it to the active project
    codekit_addProject(projectPath = false) {
        projectPath = projectPath || atom.project.getPaths()[0];
        osascript.execute(`tell application "CodeKit" to add project at path "${projectPath}"`, function(err, result, raw) {});
    },

    // Tells CodeKit to swtich to the specified project
    codekit_switchProject(projectPath = false) {
        projectPath = projectPath || atom.project.getPaths()[0];
        osascript.execute(`tell application "CodeKit" to select project containing path "${projectPath}"`, function(err, result, raw) {});
    }

};