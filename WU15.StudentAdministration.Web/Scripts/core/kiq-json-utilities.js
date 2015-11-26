
var Utilities = new function Utilities() {

    Utilities.formToJson = function (form) {
        var jsonForm = {};
        $("input", $(form)).each(function (index) {
            jsonForm[$(this).attr("name")] = this.value;
        });

        return jsonForm;
    }

    return Utilities;
}


