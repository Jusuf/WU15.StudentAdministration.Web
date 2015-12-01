$(document).ready(function () {

    // Setup initial page parameters.
    Page.setup({
        numberOfColumnsPerRow: 3,
        studentsUrl: "http://localhost:45959/api/students/",
        coursesUrl: "http://localhost:45959/api/courses/",
        //studentsUrl: "http://api.wu15.se/api/students/",
        //coursesUrl: "http://api.wu15.se/api/courses/",
        defaultPlaceholder: $("#defaultPlaceholder"),
        courseDetailsPlaceholder: $("#courseDetailsPlaceholder"),
        courseDetailsStudentListPlaceholder: $("#courseDetailsStudentListPlaceholder"),
        courseDetailsStudentSelectList: $("#courseDetailsStudentSelectList"),
        courseListPlaceholder: $("#courseListPlaceholder"),
        studentListPlaceholder: $("#studentListPlaceholder"),
        panelBodyPlaceholder: $("#panelBodyPlaceholder"),
        studentListFormPlaceholder: $("#studentListFormBody"),
        studentSearchPlaceholder: $("#studentSearchFormBody"),
        studentsDefaultplaceholder: $(".studentsDefaultplaceholder")
    });

    // Do some page bootstrapping.
    Page.init();
});

      
