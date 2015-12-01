// Sort by student name 
sortByStudentName = function (students) {
    sortedStudents = students.sort(function (a, b) {
        if (a.firstName < b.firstName)
            return -1;
        if (a.firstName > b.firstName)
            return 1;
        return 0;
    }
   
)
    return sortedStudents;
};

//Sort by course name 
sortByCourseName = function (courses) {
    sortedCourses = courses.sort(function (a, b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    }
)
    return sortedCourses;
};

cleareditStudentBox = function () {

    $("input[name$='firstName']").val("");
    $("input[name$='lastName']").val("");
    $("input[name$='ssn']").val("");
    $("input[name$='id']").val(null);
    $("input[name$='active']").val(null);
};

clearSearchStudentBox = function () {
    $("input[name$='searchString']").val("");
};

// Resets color on Add Student/Course and Search Student menus
resetActiveColor = function () {

    $("#searchStudent").css({ "color": "black" });
    $("#addStudent").css({ "color": "black" });
    $("#addCourse").css({ "color": "black" });
};

resetMenuText = function () {
    $("#addStudent").text('Lägg Till Student.');
    $("#searchStudent").text('Sök Student.');
    $("#addCourse").text('Lägg Till Kurs.');
};












