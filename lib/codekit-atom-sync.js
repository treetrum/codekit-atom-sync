'use babel';

import {CompositeDisposable} from 'atom';

const osascript = require('node-osascript');
const fileExists = require('file-exists');

const configFileNames = [
    'config.codekit3',
    '.config.codekit3',
    'config.codekit'
]

const messages = {
    paused: "CodeKit Atom Sync Paused",
    resumed: "CodeKit Atom Sync Resumed"
};

export default {

    subscriptions: null,
    workspaceSubscriptions: null,

    activate(state) {

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'codekit-atom-sync:open-codekit': () => this.codekit_open(),
            'codekit-atom-sync:add-project-to-codekit': () => this.codekit_addProject(),
            'codekit-atom-sync:toggle-codekit-atom-sync': () => this.toggleWorkspaceSubscriptions()
        }));

        this.registerWorkspaceSubscriptions();

    },

    deactivate() {
        this.subscriptions.dispose();
        this.workspaceSubscriptions.dispose();
    },

    serialize() {
        return {};
    },


    /*
    |--------------------------------------------------------------------------
    | Atom Commands
    |--------------------------------------------------------------------------
    */

    // Toggles the core project switching subscriptions.
    // Used when 'pausing' and 'resuming' the plugin.
    toggleWorkspaceSubscriptions() {

        if (this.workspaceSubscriptions.disposed) {

            // Dismiss the paused notification
            atom.notifications.getNotifications().forEach(notification => {
                if (notification.getMessage() == messages.paused) {
                    notification.dismiss();
                }
            });

            // Add a resumed notification
            atom.notifications.addInfo(messages.resumed);

            // Resume plugin
            this.registerWorkspaceSubscriptions();

        } else {

            // Add paused notification
            atom.notifications.addInfo(messages.paused, {dismissable: true});

            // Pause plugin
            this.deregisterWorkspaceSubscriptions();
        }
    },

    // Registers the core project switching subscriptions
    registerWorkspaceSubscriptions() {
        // Add event listener for workspace opening something
        this.workspaceSubscriptions = new CompositeDisposable();
        this.workspaceSubscriptions.add(atom.workspace.onDidOpen( this.atom_environmentChanged.bind(this) ));
    },

    // Deregisters the core project switching subscriptions
    deregisterWorkspaceSubscriptions() {
        this.workspaceSubscriptions.dispose();
    },

    // Determines if this folder is a codekit project.
    // If it is - it adds and switches to it in CodeKit
    atom_environmentChanged(event) {

        let path = atom.project.getPaths()[0];

        let configFileExists = false;
        configFileNames.forEach( filename => {
            if (fileExists.sync(`${path}/${filename}`)) {
                configFileExists = true;
            }
        });

        // If config file exists
        if (configFileExists) {
            // Switch/Add project
            this.codekit_addProject(path);
            this.codekit_switchProject(path);
        } else {
            // Then this isn't a Codekit Project. Do nothing.
        }

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