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

  $(document).ready(function () {
    let x = 0;

    $("#test").click(function () {
      func("test");
    });

    $("#compile").click(function () {
      func("compile");
    });

    $("#publish").click(function () {
      func("publish");
    });

    $("#argsbutton").click(function () {
      const a = $("#args").val();
      $(this).after("<input placeholder='enter the args' />");
      console.log(a);
    });

    $("#add").click(function () {
      $("#sub").after(`
      <div class="form-inline" id="fields${x}">
        <input placeholder='argument name' style="width:49%" id="value${x}" />
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        <input placeholder='argument type' style="width:49%" id="type${x}" align="right"/>
      </div>`);
      x++;
      console.log(x);
    });

    $("#sub").click(function () {
      x--;
      $(`#fields${x}`).hide();
    });
  });

  // document.getElementById("test").addEventListener("click", function () {
  //   func("test");
  // });

  // document.getElementById("compile").addEventListener("click", function () {
  //   func("compile");
  // });
})();
