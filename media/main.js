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

  function toHex(str) {
    var result = '';
    for (var i=0; i<str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return result;
  }
  
  $(document).ready(function () {
    let args = 0;
    let type_args = 0;

    $(".fundblock").hide();

    $("#test").click(function () {
      func("test");
    });

    $("#test1").click(function () {
      console.log("This is from the test");
      func("test");
    });


    $("#compile").click(function () {
      console.log(toHex("dhruv d jain"));
      func("compile");
    });

    $("#publish").click(function () {
      func("publish");
    });

    $("#runOnWindow").click(function () {
      func("runOnWindow");
    });

    $("#clean").click(function () {
      func("clean");
    });

    $("#fundopener").click(function() {
      $(".fundblock").toggle();
    });

    $("#fundWallet").click(function() {
      const accountAddress = $("#accountAddress").val();
      vscode.postMessage({
        command: "fund",
        payload: accountAddress,
      }); 
    });

    $("#argsbutton").click(function () {
      const a = $("#args").val();
      $(this).after("<input placeholder='enter the args' />");
      console.log(a);
    });

    ['address','bool','hex','hex_array','string','u8','u64','u128','raw']

    $("#add").click(function () {
      $("#sub").after(`
      <div class="form-inline" id="fields${args}">
        <input placeholder='argument name' style="width:49%" id="value${args}" />
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        <input list="types" placeholder='argument type' style="width:49%" id="type${args}" align="right">
          <datalist id="types">
            <option value="address">
            <option value="bool">
            <option value="hex">
            <option value="hex_array">
            <option value="string">
            <option value="u8">
            <option value="u64">
            <option value="u128">
            <option value="raw">
          </datalist>
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
        if (obj.type === "string") {
          obj.type = "hex";
          obj.name = toHex(obj.name);
        }
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
