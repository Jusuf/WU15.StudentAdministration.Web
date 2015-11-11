//Sort by student name function
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