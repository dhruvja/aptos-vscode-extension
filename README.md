# Aptos Move Publisher 

You can Publish and run move functions using a user friendly interface.

## Features

When you enter string in CLI, you cannot have spaces or any special characters. If you want something like that, you would need to convert it to hex and then use it.
But in this extension, you just need to enter the string and it gets automatically converted to hex.

For eg: `--args string:abc sdc`
the string "abc and sdc" is not possible to post in cli
so instead u need to use 
`--args hex:61626320736463`
which is the hex for above string. And this becomes a pain to do for strings, so instead this extension does the conversion automatically.

Also it is easy to edit the arguments with the UI
## How to use

You will get a icon on the sidebar which would enable you run, compile, publish, test and also fund your account.
When you click on run, a window would open where you can enter the arguments along with the type which is displayed as a dropdown.

The comands will run in the terminal so if there is no active terminal, it will create one for you.

Please open the folder containing the move modules with move.toml for the extension to work properly.



