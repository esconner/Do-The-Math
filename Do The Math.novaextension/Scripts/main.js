var mexp = require('./math-expression-evaluator.min.js');

exports.activate = function() {
    // Do work when the extension is activated
}

exports.deactivate = function() {
    // Clean up state before the extension is deactivated
}

nova.commands.register("do-the-math-and-replace.compute", (editor) => {
    // Replaces the selected text with the evaluated string.
    var selectedRanges = editor.selectedRanges.reverse();
    editor.edit(function(e) {
        for (var range of selectedRanges) {
            var text = editor.getTextInRange(range);
            try {
                var newText = "" + mexp.eval(text);
                e.delete(range);
                e.insert(range.start, newText);
            }
            catch(e) {
                console.error(e.message);
            }
        }
    });
});

nova.commands.register("do-the-math.compute", (editor) => {
    // Appends the evaluated string to the expression.
    var selectedRanges = editor.selectedRanges.reverse();
    editor.edit(function(e) {
        for (var range of selectedRanges) {
            var text = editor.getTextInRange(range);
            try {
                var newText = " = " + mexp.eval(text);
                e.insert(range.end, newText)
            }
            catch(e) {
                console.error(e.message);
            }
        }
    });
});