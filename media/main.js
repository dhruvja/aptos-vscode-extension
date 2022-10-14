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
    let args = 0;
    let type_args = 0;

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
      <div class="form-inline" id="fields${args}">
        <input placeholder='argument name' style="width:49%" id="value${args}" />
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        <input placeholder='argument type' style="width:49%" id="type${args}" align="right"/>
      </div>`);
      args++;
      console.log(args);
    });

    $("#sub").click(function () {
      args--;
      $(`#fields${args}`).hide();
    });

    $("#addtype").click(function () {
      $("#subtype").after(
        `<input placeholder='argument name' id="typevalue${type_args}" />`
      );
      type_args++;
      console.log(type_args);
    });

    $("#subtype").click(function () {
      type_args--;
      $(`#typevalue${type_args}`).hide();
    });

    $("#run").click(function () {
      let i = 0;
      let arguments = [];
      let typeArguments = [];
      for (i = 0; i < args; i++) {
        let obj = {};
        obj.name = $(`#value${i}`).val();
        obj.type = $(`#type${i}`).val();
        arguments.push(obj);
      }

      for (i = 0; i < type_args; i++) {
        let value = $(`#typevalue${i}`).val();
        typeArguments.push(value);
      }

      let profile = $("#profile").val();
      let functionName = $("#function").val();

      let res = {};
      res.profile = profile;
      res.functionName = functionName;
      res.args = arguments;
      res.typeArguments = typeArguments;

      console.log(res);
      vscode.postMessage({
        command: "run",
        payload: res,
      });
    });
  });

  // document.getElementById("test").addEventListener("click", function () {
  //   func("test");
  // });

  // document.getElementById("compile").addEventListener("click", function () {
  //   func("compile");
  // });
})();
