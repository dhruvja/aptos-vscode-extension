import * as vscode from "vscode";
import { getNonce, getUri, LocalStorageService } from "./utils";

export class HelloWordPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: HelloWordPanel | undefined;

  public static readonly viewType = "hello world";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];
  private readonly _context: vscode.ExtensionContext;

  public static createOrShow(extensionUri: vscode.Uri, context: vscode.ExtensionContext){
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    if (HelloWordPanel.currentPanel) {
      HelloWordPanel.currentPanel._panel.reveal(column);
      HelloWordPanel.currentPanel._update(extensionUri);
      return;
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      HelloWordPanel.viewType,
      "Aptos Move",
      vscode.ViewColumn.One,
      {
        // Enable javascript in the webview
        enableScripts: true,
        retainContextWhenHidden: true,
        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, "media"),
          vscode.Uri.joinPath(extensionUri, "out/compiled"),
        ],
      }
    );

    HelloWordPanel.currentPanel = new HelloWordPanel(panel, extensionUri, context);
    return panel;
  }

  public static kill() {
    HelloWordPanel.currentPanel?.dispose();
    HelloWordPanel.currentPanel = undefined;
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, context: vscode.ExtensionContext) {
    HelloWordPanel.currentPanel = new HelloWordPanel(panel, extensionUri, context);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, context: vscode.ExtensionContext) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._context = context;

    // Set the webview's initial html content
    this._update(extensionUri);

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // // Handle messages from the webview
    // this._panel.webview.onDidReceiveMessage(
    //   (message) => {
    //     switch (message.command) {
    //       case "alert":
    //         vscode.window.showErrorMessage(message.text);
    //         return;
    //     }
    //   },
    //   null,
    //   this._disposables
    // );
  }

  public dispose() {
    HelloWordPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private async _update(
    extensionUri: vscode.Uri,
  ) {
    const webview = this._panel.webview;

     

    let storageManager = new LocalStorageService(this._context.workspaceState);
    storageManager.setValue<String>("Run", "hey");

    this._panel.webview.html = this._getHtmlForWebview(webview, extensionUri);
    webview.onDidReceiveMessage(async (message) => {
      let terminal;
      switch (message.command) {
        case "compile":
          terminal = vscode.window.activeTerminal;
          if (terminal === undefined) {
            terminal = vscode.window.createTerminal(`Ext Terminal #3`);
          }
          terminal.show();
          terminal.sendText("aptos move compile");
          let someOtherObject = storageManager.getValue<String>("Run");
          console.log(someOtherObject);
          return;
        case "test":
          terminal = vscode.window.activeTerminal;
          if (terminal === undefined) {
            terminal = vscode.window.createTerminal(`Ext Terminal #3`);
          }
          terminal.show();
          terminal.sendText("aptos move test");
          return;
        case "publish":
          terminal = vscode.window.activeTerminal;
          if (terminal === undefined) {
            terminal = vscode.window.createTerminal(`Ext Terminal #3`);
          }
          terminal.show();
          terminal.sendText("aptos move publish");
          return;

        case "fund":
          terminal = vscode.window.activeTerminal;
          if (terminal === undefined) {
            terminal = vscode.window.createTerminal(`Ext Terminal #3`);
          }
          terminal.show();
          terminal.sendText(
            `aptos account fund-with-faucet --account ${message.payload}`
          );
          return;
        case "run":
          const space = " ";
          let command = "aptos move run" + space;
          const profile = "--profile" + space + message.payload.profile + space;
          const functionId =
            "--function-id " + message.payload.functionName + space;
          let args = "";
          message.payload.args.forEach((arg: any) => {
            args += arg.type + ":" + arg.name + space;
          });
          let type_args = "";
          message.payload.typeArguments.forEach((arg: any) => {
            if (arg === "") return;
            type_args += arg;
          });
          if (type_args !== "") {
            type_args = "--type-args " + type_args;
          }
          const argument = "--args" + space + args;
          command += profile + functionId + argument + type_args;
          console.log(command);
          terminal = vscode.window.activeTerminal;
          if (terminal === undefined) {
            terminal = vscode.window.createTerminal(`Ext Terminal #3`);
          }
          terminal.show();
          terminal.sendText(command);
          return;
      }
    });
  }

  private _getHtmlForWebview(
    webview: vscode.Webview,
    extensionUri: vscode.Uri
  ) {
    // // And the uri we use to load this script in the webview
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
    );

    const toolkitUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "toolkit.js")
    );

    console.log(toolkitUri);
    // Uri to load styles into webview
    const stylesResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const stylesMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const jquery = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "jquery-3.6.1.min.js")
    );
    // const cssUri = webview.asWebviewUri(
    //   vscode.Uri.joinPath(this._extensionUri, "out", "compiled/swiper.css")
    // );

    // Use a nonce to only allow specific scripts to be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${stylesResetUri}" rel="stylesheet">
				<link href="${stylesMainUri}" rel="stylesheet">
        <script nonce="${nonce}" type="module" src=${toolkitUri}></script>
        <script nonce="${nonce}" src=${jquery}></script>
			</head>
        <body>
            <h1>Aptos Move Publisher</h1>
            <label>Enter Profile</label>
            <input id="profile" name="args" placeholder="profile name"/>
            <br />
            <label>Enter Function Name</label>
            <h5> Eg: published_address::Ticket::init_venue </h5>
            <h5>Can even use profile names like default::Ticket::init_venue or 9893409...909::Ticket::init_venue</h5>
            <input id="function" name="args" placeholder="Profile::ModuleName::function_name"/>
            <h3>Function Arguments</h3>
            <button id="add" style="width: 10%">Add</button>
            <button id="sub" style="width: 10%">Delete</button>
            <h3>Type Arguments</h3>
            <h5>Leave empty if there isnt any</h5>
            <h5>Eg: 0x1::aptos_coin::AptosCoin</h5>
            <button id="addtype" style="width: 10%">Add</button>
            <button id="subtype" style="width: 10%">Delete</button>
            <button id="run"> Run </button>
            <!-- <button id="compile"> Compile </button>
            <button id="test"> Test </button>
            <button id="publish"> Publish </button>
            <button id="fundopener"> Fund </button>
            <div class="fundblock">
            <input id="accountAddress" placeholder="Enter the account address" /> <br />
            <button id="fundWallet">Fund Wallet with Faucet</button>
            <div>--> 
		</body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</html>`;
  }
}
