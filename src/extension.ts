// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { HelloWordPanel } from "./helloWordPanel";
import * as cp from "child_process";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "movecli" is now active!');

  context.subscriptions.push(
    vscode.commands.registerCommand("movecli.helloWorld", () => {
      let panel = HelloWordPanel.createOrShow(context.extensionUri);

      panel.webview.onDidReceiveMessage(
        async (message) => {
          let terminal;
          switch (message.command) {
            case "compile":
              terminal = vscode.window.activeTerminal;
              if (terminal === undefined) {
                terminal = vscode.window.createTerminal(`Ext Terminal #3`);
              }
              terminal.show();
              terminal.sendText("aptos move compile");
              return;
            case "test":
              terminal = vscode.window.activeTerminal;
              if (terminal === undefined) {
                terminal = vscode.window.createTerminal(`Ext Terminal #3`);
              }
              terminal.show();
              terminal.sendText("aptos move test");
              return;
          }
        },
        undefined,
        context.subscriptions
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("movecli.askQuestion", async () => {
      const answer = await vscode.window.showInformationMessage(
        "How was your day",
        "good",
        "bad"
      );
      if (answer === "good") {
        console.log("good");
      } else {
        vscode.window.showInformationMessage("Sad to hear that from you");
      }
    })
  );
}

const execShell = (cmd: string) =>
  new Promise<string>((resolve, reject) => {
    cp.exec(cmd, (err, out) => {
      if (err) {
        return reject(err);
      }
      return resolve(out);
    });
  });

function selectTerminal(): Thenable<vscode.Terminal | undefined> {
  interface TerminalQuickPickItem extends vscode.QuickPickItem {
    terminal: vscode.Terminal;
  }
  const terminals = <vscode.Terminal[]>(<any>vscode.window).terminals;
  const items: TerminalQuickPickItem[] = terminals.map((t) => {
    return {
      label: `name: ${t.name}`,
      terminal: t,
    };
  });
  return vscode.window.showQuickPick(items).then((item) => {
    return item ? item.terminal : undefined;
  });
}

function ensureTerminalExists(): boolean {
  if ((<any>vscode.window).terminals.length === 0) {
    vscode.window.showErrorMessage("No active terminals");
    return false;
  }
  return true;
}

// This method is called when your extension is deactivated
export function deactivate() {}
