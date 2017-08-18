'use babel';

import CodekitAtomSyncView from './codekit-atom-sync-view';
import { CompositeDisposable } from 'atom';

export default {

  codekitAtomSyncView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.codekitAtomSyncView = new CodekitAtomSyncView(state.codekitAtomSyncViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.codekitAtomSyncView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'codekit-atom-sync:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.codekitAtomSyncView.destroy();
  },

  serialize() {
    return {
      codekitAtomSyncViewState: this.codekitAtomSyncView.serialize()
    };
  },

  toggle() {
    console.log('CodekitAtomSync was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
