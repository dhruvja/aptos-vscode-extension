// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { HelloWordPanel } from "./helloWordPanel";
import * as cp from "child_process";
import { SidebarProvider } from "./sideBarProvider";
import { LocalStorageService } from "./utils";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "movecli" is now active!');

  const versionKey = "123";
  

  context.subscriptions.push(
    vscode.commands.registerCommand("movecli.helloWorld", () => {
      let panel = HelloWordPanel.createOrShow(context.extensionUri, context);

    //   panel.webview.onDidReceiveMessage(
    //     async (message) => {
    //       let terminal;
    //       switch (message.command) {
    //         case "compile":
    //           terminal = vscode.window.activeTerminal;
    //           if (terminal === undefined) {
    //             terminal = vscode.window.createTerminal(`Ext Terminal #3`);
    //           }
    //           terminal.show();
    //           terminal.sendText("aptos move compile");
    //           return;
    //         case "test":
    //           terminal = vscode.window.activeTerminal;
    //           if (terminal === undefined) {
    //             terminal = vscode.window.createTerminal(`Ext Terminal #3`);
    //           }
    //           terminal.show();
    //           terminal.sendText("aptos move test");
    //           return;
    //         case "publish":
    //           terminal = vscode.window.activeTerminal;
    //           if (terminal === undefined) {
    //             terminal = vscode.window.createTerminal(`Ext Terminal #3`);
    //           }
    //           terminal.show();
    //           terminal.sendText("aptos move publish");
    //           return;

    //         case "fund":
    //           terminal = vscode.window.activeTerminal;
    //           if (terminal === undefined) {
    //             terminal = vscode.window.createTerminal(`Ext Terminal #3`);
    //           }
    //           terminal.show();
    //           terminal.sendText(
    //             `aptos account fund-with-faucet --account ${message.payload}`
    //           );
    //           return;
    //         case "run":
    //           const space = " ";
    //           let command = "aptos move run" + space;
    //           const profile =
    //             "--profile" + space + message.payload.profile + space;
    //           const functionId =
    //             "--function-id default::" +
    //             message.payload.functionName +
    //             space;
    //           let args = "";
    //           message.payload.args.forEach((arg: any) => {
    //             args += arg.type + ":" + arg.name + space;
    //           });
    //           let type_args = "";
    //           message.payload.typeArguments.forEach((arg: any) => {
    //             if (arg === "") return;
    //             type_args += arg;
    //           });
    //           if (type_args !== "") {
    //             type_args = "--type-args " + type_args;
    //           }
    //           const argument = "--args" + space + args;
    //           command += profile + functionId + argument + type_args;
    //           console.log(command);
    //           terminal = vscode.window.activeTerminal;
    //           if (terminal === undefined) {
    //             terminal = vscode.window.createTerminal(`Ext Terminal #3`);
    //           }
    //           terminal.show();
    //           terminal.sendText(command);
    //           return;
    //       }
    //     },
    //     undefined,
    //     context.subscriptions
    //   );
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

  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "aptosmove-sidebar",
      sidebarProvider
    )
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
