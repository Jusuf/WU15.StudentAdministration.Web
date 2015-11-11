
var Page = new function Page() {
    var configuration = null;

    // Initial setup.
    Page.setup = function (config) {
        configuration = config;
    }

    // Initial rendering.                                           initierar genom att kalla på navigate funktionen med "start" som argument
    Page.init = function () {
        Page.navigate("start");
    }


    // Fetch and display all courses.
    Page.displayDefault = function () {
        configuration.courseDetailsPlaceholder.hide();

        $.ajax({
            type: "GET",
            url: configuration.coursesUrl,
            data: { sid: configuration.organizationId }
        }).done(function (data) {

            // Render the courses.
            Page.renderDefault(data);

        }).error(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText || textStatus);
        });
    }


    // Fetch the data and delegate the rendering of the page.
    Page.displayCourseList = function () {

        $.ajax({
            type: "GET",
            url: configuration.coursesUrl,
            data: { sid: configuration.organizationId }
        }).done(function (data) {
            console.log("[Page.displayCourseList]: Number of items returned: " + data.length);

            // Render the courses.
            Page.renderCourseList(data);

        }).error(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText || textStatus);
        });
    }

    // Fetch the data and render the page.
    Page.displayStudentList = function () {


        $.ajax({
            type: "GET",
            url: configuration.studentsUrl,
            data: { sid: configuration.organizationId }
        }).done(function (data) {
            console.log("[Page.displayStudentList]: Number of items returned: " + data.length);
                       
        var sortedData = sortByStudentName(data);

        Page.renderStudentList(sortedData);
        debugger;
        }).error(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText || textStatus);
        });
    }

    Page.renderDefault = function (courses) {
        var view = "";
        configuration.defaultPlaceholder.empty();

        var courseIndex = 0;
        for (var contentIndex = 0; contentIndex < courses.length; contentIndex = contentIndex + configuration.numberOfColumnsPerRow) {
            var item = "<div class='row list-item'>";

            var tempCourseIndex = courseIndex;
            if ((tempCourseIndex + configuration.numberOfColumnsPerRow) > courses.length) {
                tempCourseIndex = courses.length;
            } else {
                tempCourseIndex = tempCourseIndex + configuration.numberOfColumnsPerRow;
            }

            // Iterate the courses.
            // Calculate witch bootstrap class to use. 
            // Bootstrap uses a 12 column grid system. 
            var bootstrapColumns = 12 / configuration.numberOfColumnsPerRow;
            for (; courseIndex < (tempCourseIndex) ; courseIndex++) {
                item += "<div class='col-md-" + bootstrapColumns + "'>";
                item += "<div class='list-group'>";
                item += "<a href='#' class='list-group-item active data-course-item' data-item-id='"
                    + courses[courseIndex].id + "'>"
                    + "<span class='list-group-addon glyphicon glyphicon-edit'></span>&nbsp;" // The edit icon.
                    + courses[courseIndex].name
                    + "</a>";
                item += "<p class='list-group-item course-item-info'>Kursstart " + courses[courseIndex].term + " " + courses[courseIndex].year + "</p>";

                // Students
                if (courses[courseIndex].students.length > 0) {
                    for (var subIndex = 0; subIndex < courses[courseIndex].students.length; subIndex++) {
                        item += "<a href='#' class='list-group-item'>" + courses[courseIndex].students[subIndex].firstName + " " + courses[courseIndex].students[subIndex].lastName + "<span class='ssnDefaultView'>" + courses[courseIndex].students[subIndex].ssn + "</span></a>";
                    }
                } else {
                    item += "<span class='list-group-item'>Kursen har inga studenter registrerade.</span>";
                }

                item += "</div>";
                item += "</div>";
            }

            item += "</div>";
            view += item;
        }

        // Append the html content to the div.
        configuration.defaultPlaceholder.append(view);

        // Display the content.
        configuration.defaultPlaceholder.fadeIn(500);
    }

    Page.renderCourseList = function (courses) {
        var tbody = $("#courseListTable tbody");
        tbody.empty();

        var html = "";
        for (var index = 0; index < courses.length; index++) {
            html += "<tr>";
            html += "<td>" + courses[index].name + "</td>";
            html += "<td>" + courses[index].credits + "</td>";
            html += "<td>" + courses[index].students.length + "</td>";
            html += "</tr>";
        }
        tbody.append(html);

        configuration.courseListPlaceholder.fadeIn(500);
    }


    Page.renderStudentList = function (students) {
        var tbody = $("#studentListTable tbody");
        tbody.empty();

        var view = "";                                         

        for (var index = 0; index < students.length; index++) {
            view += "<tr>";
            view += "<td>" + students[index].firstName + "</td>";
            view += "<td>" + students[index].lastName + "</td>";
            view += "<td>" + students[index].ssn + "</td>";

            view += "<td><input data-studentId='" + students[index].id + "' class='aiCheckbox' type='checkbox' name='studentStatus' value='Student'><span class='spanActive'>Aktiv</span><span data-editId='" + students[index].id + "' href='#' class='glyphicon glyphicon-edit'></span></td>";

            view += "</tr>";

        }
        tbody.append(view);
        //configuration.studentListPlaceholder.append(view);

        configuration.studentListPlaceholder.fadeIn(500);
    }

    Page.displayCourseDetails = function (id) {
        console.log("[Page.displayCourseDetails]: Fetching item having id: " + id);

        $.ajax({
            type: "GET",
            url: configuration.coursesUrl + id
        }).done(function (data) {

            console.log(data);

            Page.renderCourseDetails(data);

        }).error(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText || textStatus);
        });
    }

    Page.renderCourseDetails = function (course) {
        // Hide the default view.
        configuration.defaultPlaceholder.hide();

        // Map all form values from the course object to the form.
        var form = configuration.courseDetailsPlaceholder.find("form")[0];
        $(form["id"]).val(course.id);
        $(form["name"]).val(course.name);
        $(form["credits"]).val(course.credits);
        $(form["year"]).val(course.year);
        $(form["term"]).val(course.term);

        // Set the details panel top header text.
        $(form).find('[name=title]').text(course.name);

        // Render the registered students.
        Page.renderCourseDetailsStudentList(course);

        // Render and fill the student select list.
        Page.renderCourseDetailsStudentSelectList();

        // Display the details panel.
        configuration.courseDetailsPlaceholder.fadeIn(500);
    }

    Page.renderCourseDetailsStudentList = function (course) {
        configuration.courseDetailsStudentListPlaceholder.empty();
        if (course.students.length) {
            for (var index = 0; index < course.students.length; index++) {
                configuration.courseDetailsStudentListPlaceholder.append(
                    "<div class='list-group-item registered-student' data-id='"
                    + course.students[index].id
                    + "' data-first-name='"
                    + course.students[index].firstName
                    + "' data-last-name='"
                    + course.students[index].lastName
                    + "' data-ssn='"
                    + course.students[index].ssn
                    + "'>"
                    + course.students[index].firstName
                    + " "
                    + course.students[index].lastName
                    + "<div class='inline-registred-student'> "
                    + "<span class='ssnSpace'>" + course.students[index].ssn + "</span>"
                    
                   
                    // Render the trash can, the remove student button.
                    + "<span class='pull-right'><button class='remove-registered-student btn btn-xs btn-warning'><span class='glyphicon glyphicon-trash'></span></button></span></div>"

                     

                    + "</div>");
            }
        } else {
            configuration
                .courseDetailsStudentListPlaceholder
                .append("<div>Inga studenter registrerade.</div>");
        }
    }

    Page.renderCourseDetailsStudentSelectList = function () {

        $.ajax({
            type: "GET",
            url: configuration.studentsUrl,
            data: { sid: configuration.organizationId }
        }).done(function (data) {

            configuration.courseDetailsStudentSelectList.empty();
            $.each(data, function () {
                Page.appendStudentSelectOption(this);
            });

        }).error(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText || textStatus);
        });

    }

    Page.appendStudentSelectOption = function (student) {
        var name = "<span class='name-dropdown-list'>" + student.firstName + " " + student.lastName + "</span>" 
        + "   " + "<span class='ssn-dropdown-list'>" + student.ssn + "</span>";  

        configuration.courseDetailsStudentSelectList.append(
            $("<option />")
            //.text(name)
            .html(name)
            .attr("data-id", student.id)
            .attr("data-first-name", student.firstName)
            .attr("data-last-name", student.lastName)
            .attr("data-ssn", student.ssn));
    }

    // Saves a course and displays the default view.
    Page.saveCourseAndDisplayDefault = function (course) {

        $.ajax({
            url: configuration.coursesUrl,
            type: "POST",
            data: JSON.stringify(course),
            contentType: "application/json",
            success: function (data, textStatus, jqXHR) {
                console.log("[Page.saveCourseAndDisplayDefault.success]: Results: " + data);

                // De-scelect the top menu button.
                //Page.deselectMenu();

                // Display the default contents.
                Page.displayDefault();
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });

    }

    // Saves a course and does'nt do a view update.
    Page.saveCourseDetails = function (course) {

        $.ajax({
            url: configuration.coursesUrl,
            type: "POST",
            data: JSON.stringify(course),
            contentType: "application/json",
            success: function (data, textStatus, jqXHR) {
                console.log("[Page.saveCourseDetails.success]: Results: " + data);

                // Brodcast course added event.
                $.event.trigger({
                    type: "courseSavedCustomEvent",
                    message: { description: "Saved a course.", data: course },
                    time: new Date()
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });

    }

    Page.appendStudentToList = function (student) {
        configuration.courseDetailsStudentListPlaceholder.append(
                    "<div class='list-group-item registered-student' data-id='"
                    + student.id
                    + "' data-first-name='"
                    + student.firstName
                    + "' data-last-name='"
                    + student.lastName
                    + "' data-last-name='"
                    + student.ssn
                    + "'>"
                    + student.firstName
                    + " "
                    + student.lastName
                    + " "
                    + "<div class='inline-registred-student'>"
                    + "<span class='ssnSpace'>" + student.ssn + "</span>"

                    // Render the trash can remove student button.
                    + "<span class='pull-right'><button class='remove-registered-student btn btn-xs btn-warning'><span class='glyphicon glyphicon-trash'></span></button></span></div>"

                    + "</div>");
    }

    Page.getCourseTemplate = function () {
        var course = {
            id: 0,
            name: "",
            credits: 0,
            schoolNo: configuration.organizationId,
            students: []
        }

        return course;
    }

    Page.getStudentTemplate = function () {
        var student = {
            id: 0,
            name: "",
            lastname: "",
            ssn: "",
            schoolNo: configuration.organizationId,
            //students: []
        }

        return student;
    }

    Page.saveStudentDetails = function (student) {

        $.ajax({
            url: configuration.studentsUrl,
            type: "POST",
            data: JSON.stringify(student),
            contentType: "application/json",
            success: function (data, textStatus, jqXHR) {
                console.log("[Page.saveStudentDetails.success]: Results: " + data);

                // Brodcast student added event.
                $.event.trigger({
                    type: "studentSavedCustomEvent",
                    message: { description: "Saved a student.", data: student },
                    time: new Date()
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });

    }



    Page.registerSelectedStudent = function () {
        var selectedStudentOption
            = configuration
                .courseDetailsStudentSelectList
                .find('option:selected');
        var id = selectedStudentOption.data("id");
        var firstName = selectedStudentOption.data("firstName");
        var lastName = selectedStudentOption.data("lastName");
        var ssn = selectedStudentOption.data("ssn")
        var student = { id: id, firstName: firstName, lastName: lastName, ssn: ssn }
        selectedStudentOption.remove();

        // Remove the empty list default text.
        var numberOfRegisteredStudents
            = configuration.courseDetailsStudentListPlaceholder
                .find(".registered-student")
                .length;
        if (numberOfRegisteredStudents === 0) {
            configuration.courseDetailsStudentListPlaceholder.empty();
        }

        Page.appendStudentToList(student);

        console.log("Registring student having id " + id + ".");
    }

    Page.navigate = function (panel) {
        switch (panel) {
            case "start":
                configuration.courseDetailsPlaceholder.hide();
                configuration.courseListPlaceholder.hide();
                configuration.studentListPlaceholder.hide();

                Page.displayDefault();

                break;
            case "courses":
                configuration.courseDetailsPlaceholder.hide();
                configuration.defaultPlaceholder.hide();
                configuration.studentListPlaceholder.hide();

                Page.displayCourseList();

                break;
            case "students":
                configuration.courseDetailsPlaceholder.hide();
                configuration.defaultPlaceholder.hide();
                configuration.courseListPlaceholder.hide();

                Page.displayStudentList();

                break;
            case "addCourse":
                configuration.courseDetailsPlaceholder.hide();
                configuration.defaultPlaceholder.hide();
                configuration.courseListPlaceholder.hide();
                configuration.studentListPlaceholder.hide();  //La till 151028 Bug fix

                var course = Page.getCourseTemplate();
                Page.renderCourseDetails(course);

                break;
            default:
                configuration.courseDetailsPlaceholder.hide();
                Page.displayDefault();
        }
    }

    Page.deselectMenu = function () {

        $('.navbar li.active').removeClass('active');
    }




    Page.displayStudentInEditBox = function (id) {

        $.ajax({
                type: "GET",
                url: configuration.studentsUrl,
                data: { sid: configuration.organizationId }
            }).done(function (data) {
                console.log("[Page.displayStudentList]: Number of items returned: " + data.length);

                //var data = {}
                Page.editStudent(data, id);

            }).error(function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText || textStatus);
            });
        }

    Page.editStudent = function (students, id) {
        for (var index = 0; index < id; index++) {
            if (id === students[index].id) {
                console.log(students[index]);
                //return students[index];
                $("input[name$='firstName']").val(students[index].firstName);
                $("input[name$='lastName']").val(students[index].lastName);
                $("input[name$='ssn']").val(students[index].ssn);
                $("input[name$='id']").val(students[index].id);

            } else {
                console.log("fel");
            }
           
        }

    }

    return Page;
}

