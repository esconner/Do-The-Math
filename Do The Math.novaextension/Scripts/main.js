const mexp = require('./math-expression-evaluator.min.js');

exports.activate = function() {
    // Do work when the extension is activated
}

exports.deactivate = function() {
    // Clean up state before the extension is deactivated
}

function roundNumber(number, digits) {
    const multiple = Math.pow(10, digits);
    const rndedNum = Math.round(number * multiple) / multiple;
    return rndedNum;
}

function getRoundingSettings() {
    const workspaceRoundingBehavior = nova.workspace.config.get("esconner.DoTheMath.workspaceRoundingBehavior", "enum");
    const globalRoundingBehavior = nova.config.get("esconner.DoTheMath.globalRoundingBehavior", "enum");
    var behavior = "";
    var roundingDigits = 0;
    switch (workspaceRoundingBehavior) {
        case "Use Global Setting":
            roundingDigits = nova.config.get("esconner.DoTheMath.globalRoundingDigits", "number");
            behavior = globalRoundingBehavior;
            break;
        default:
            roundingDigits = nova.workspace.config.get("esconner.DoTheMath.workspaceRoundingDigits", "number");
            behavior = workspaceRoundingBehavior;
            break;
    }
    return { behavior: behavior, digits: roundingDigits };
}

function evaluateWithRoundingSettings(expression) {
    const roundingSettings = getRoundingSettings();
    switch (roundingSettings.behavior) {
        case "None":
            return mexp.eval(expression);    
        case "Round Half Up":
            return roundNumber(mexp.eval(expression), roundingSettings.digits);
    }
}

nova.commands.register("do-the-math.compute-and-replace", (editor) => {
    // Replaces the selected text with the evaluated string.
    const selectedRanges = editor.selectedRanges.reverse();
    editor.edit(function(e) {
        for (var range of selectedRanges) {
            const text = editor.getTextInRange(range);
            try {
                const newText = "" + evaluateWithRoundingSettings(text);
                e.delete(range);
                e.insert(range.start, newText);
            }
            catch(e) {
                console.error(e.message);
            }
        }
    });
});

nova.commands.register("do-the-math.compute-and-append", (editor) => {
    // Appends the evaluated string to the expression.
    const selectedRanges = editor.selectedRanges.reverse();
    editor.edit(function(e) {
        for (var range of selectedRanges) {
            const text = editor.getTextInRange(range);
            try {
                const newText = " = " + evaluateWithRoundingSettings(text);
                e.insert(range.end, newText)
            }
            catch(e) {
                console.error(e.message);
            }
        }
    });
});