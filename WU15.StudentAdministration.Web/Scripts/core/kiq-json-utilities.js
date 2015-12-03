
var Utilities = new function Utilities() {
    
    Utilities.formToJson = function (form) {

        var jsonForm = {};
        $("input", $(form)).each(function (index) {
            jsonForm[$(this).attr("name")] = this.value ;
        });

        //debugger;

        return jsonForm;
    }
    return Utilities;
}


