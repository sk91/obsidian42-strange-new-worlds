// Sidepane used by SNW for displaying references

import {ItemView, WorkspaceLeaf} from "obsidian";
import {getReferencesCache} from "../indexer";
import ThePlugin from "../main";
import { getUIC_SidePane } from "./components/uic-ref--parent";

export const VIEW_TYPE_SNW = "Strange New Worlds";

export class SideBarPaneView extends ItemView {
    thePlugin: ThePlugin;
    
    constructor(leaf : WorkspaceLeaf, thePlugin: ThePlugin) {
        super(leaf);
        this.thePlugin = thePlugin;
    }

    getViewType() { return VIEW_TYPE_SNW }

    getDisplayText() { return "Strange New Worlds"}

    getIcon() { return "dot-network" }

    async onOpen() {
        const container: HTMLElement = this.containerEl;
        const loadingEL: HTMLElement = container.createSpan({cls:"snw-sidepane-loading"});
        const bannerEl: HTMLElement = createDiv({cls:"snw-sidepane-loading-banner"});
        bannerEl.innerText= `Discovering Strange New Worlds...`
        loadingEL.appendChild(bannerEl)
        const pendingTextEl: HTMLElement = createDiv({cls:"snw-sidepane-loading-subtext"})
        pendingTextEl.innerText = `Click a reference counter in the main document for information to appear here.`;
        loadingEL.appendChild(pendingTextEl);
        container.empty();
        container.appendChild(loadingEL);
    }

    async updateView() {
        const refType = this.thePlugin.lastSelectedReferenceType;
        const key = this.thePlugin.lastSelectedReferenceKey;
        const filePath = this.thePlugin.lastSelectedReferenceFilePath;
        const lineNu = this.thePlugin.lastSelectedLineNumber;

        if(this.thePlugin.snwAPI.enableDebugging.SidePane) {
            this.thePlugin.snwAPI.console("sidepane.open() refType, key, filePath", refType, key, filePath);
            this.thePlugin.snwAPI.console("sidepane.open() getReferencesCache()", getReferencesCache());
        }

        this.containerEl.replaceChildren(await getUIC_SidePane(refType, key, filePath, lineNu))
    }

    async onClose() { // Nothing to clean up.
    }
}
