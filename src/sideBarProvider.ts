import * as vscode from "vscode";
import { getNonce } from "./getNonce";

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (message) => {
      let terminal;
      switch (message.command) {
        case "compile":
          terminal = vscode.window.activeTerminal;
          if (terminal === undefined) {
            terminal = vscode.window.createTerminal(`Aptos Move Publisher`);
          }
          terminal.show();
          terminal.sendText("aptos move compile");
          return;
        case "test":
          terminal = vscode.window.activeTerminal;
          if (terminal === undefined) {
            terminal = vscode.window.createTerminal(`Aptos Move Publisher`);
          }
          terminal.show();
          terminal.sendText("aptos move test");
          return;
        case "runOnWindow":
          vscode.commands.executeCommand("movecli.helloWorld");
          return;
        case "publish":
          terminal = vscode.window.activeTerminal;
          if (terminal === undefined) {
            terminal = vscode.window.createTerminal(`Aptos Move Publisher`);
          }
          terminal.show();
          terminal.sendText("aptos move publish");
          return;
        case "clean":
          terminal = vscode.window.activeTerminal;
          if (terminal === undefined) {
            terminal = vscode.window.createTerminal(`Aptos Move Publisher`);
          }
          terminal.show();
          terminal.sendText("aptos move clean");
          return;
        case "fund":
          terminal = vscode.window.activeTerminal;
          if (terminal === undefined) {
            terminal = vscode.window.createTerminal(`Aptos Move Publisher`);
          }
          terminal.show();
          terminal.sendText(
            `aptos account fund-with-faucet --account ${message.payload}`
          );
          return;
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const stylesResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const stylesMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const jquery = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "jquery-3.6.1.min.js")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    // return `<!DOCTYPE html>
    // 		<html lang="en">
    // 		<head>
    // 			<meta charset="UTF-8">
    // 			<meta name="viewport" content="width=device-width, initial-scale=1.0">
    // 			<link href="${stylesResetUri}" rel="stylesheet">
    // 			<link href="${stylesMainUri}" rel="stylesheet">
    //             <script nonce="${nonce}" src=${jquery}></script>
    // 		</head>
    //   <body>
    //     <button id="test1">Hey</button>
    // 		</body>
    //         <script nonce="${nonce}" src="${scriptUri}"></script>
    // 		</html>`;
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${stylesResetUri}" rel="stylesheet">
        <link href="${stylesMainUri}" rel="stylesheet">
<script nonce="${nonce}" src=${jquery}></script>
    </head>
<body>
    <h1>Aptos Move Publisher</h1>
    <button id="runOnWindow"> Run </button>
    <button id="compile"> Compile </button>
    <button id="test"> Test </button>
    <button id="publish"> Publish </button>
    <button id="clean"> Clean </button>
    <button id="fundopener"> Fund </button>
    <div class="fundblock">
    <input id="accountAddress" placeholder="Enter the account address" /> <br />
    <button id="fundWallet">Fund Wallet with Faucet</button>
    <div>
</body>
        <script nonce="${nonce}" src="${scriptUri}"></script>
    </html>`;
  }
}
