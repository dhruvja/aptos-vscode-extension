// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.

(function () {
  const vscode = acquireVsCodeApi();

  function func(command) {
    vscode.postMessage({
      command: command,
      text: "Hello world",
    });
  }

  document.getElementById('test').addEventListener('click', function () {
    func("test"); 
  });

  document.getElementById('compile').addEventListener('click', function () {
    func("compile"); 
  });

})();
