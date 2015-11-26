

var Page = new function Page() {
    var configuration = null;

    // Initial setup.
    Page.setup = function (config) {
        configuration = config;
    }

    // Initial rendering.                                           
    Page.init = function () {
        Page.navigate("start");
    }
    
    // Fetch and display all courses in default view.
    Page.displayDefault = function () {
        configuration.courseDetailsPlaceholder.hide();

        $.ajax({
            type: "GET",
            url: configuration.coursesUrl
        }).done(function (data) {

            var sortedData = sortByCourseName(data);
            
            // Render the courses.
            Page.renderDefault(sortedData);

        }).error(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText || textStatus);
        });
    }

    // Fetch the data and delegate the rendering of the page.
    Page.displayCourseList = function () {

        $.ajax({
            type: "GET",
            url: configuration.coursesUrl
        }).done(function (data) {
            console.log("[Page.displayCourseList]: Number of items returned: " + data.length);
            var sortedCourses = sortByCourseName(data);
            // Render the courses.

            Page.renderCourseList(sortedCourses);
            configuration.defaultPlaceholder.hide();

        }).error(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText || textStatus);
        });
    }

    // Fetch the data and render the page.
    Page.displayStudentList = function () {


        $.ajax({
            type: "GET",
            url: configuration.studentsUrl
        }).done(function (data) {
            console.log("[Page.displayStudentList]: Number of items returned: " + data.length);
                       
        var sortedData = sortByStudentName(data);

        Page.renderStudentList(sortedData);
        
        }).error(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText || textStatus);
        });
    }

    // Start/default page rendering and bootstrap setup
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

                // Courses Active/Inactive
                if (courses[courseIndex].active) {
                    item += "<div class='list-group'>";
                    item += "<a href='#' class='list-group-item active data-course-item activeCourse' title='Visa/dölj studenterna.'>"
                        + "<span title='Klicka här för att redigera kursen.' class='list-group-addon glyphicon glyphicon-edit' data-item-id='"
                        + courses[courseIndex].id + "'></span>&nbsp;" // The edit icon.
                        + courses[courseIndex].name
                        + "</a>";
                    item += "<p class='list-group-item course-item-info'>Kursstart " + courses[courseIndex].term + " " + courses[courseIndex].year + "</p>";


                } else {
                    item += "<div class='list-group courseInactive'>";
                    item += "<a href='#' class='list-group-item active data-course-item' title='Aktivera kursen för att visa studenterna.'>"
                        + "<span title='Klicka här för att redigera kursen.' class='list-group-addon glyphicon glyphicon-edit' data-item-id='"
                        + courses[courseIndex].id + "'></span>&nbsp;" // The edit icon.
                        + courses[courseIndex].name
                        + "</a>";
                    item += "<p class='list-group-item course-item-info'>Kursen är inaktiverad.</p>";
                }
                
                // Students
                if (courses[courseIndex].students.length > 0) {
                    for (var subIndex = 0; subIndex < courses[courseIndex].students.length; subIndex++) {

                        // Sort students by firstname
                        var sortedByName = sortByStudentName(courses[courseIndex].students);

                        // Displays active/inactive students
                        if (sortedByName[subIndex].active) {
                            item += "<a href='#' class='list-group-item studentName'>" + sortedByName[subIndex].firstName + " " + courses[courseIndex].students[subIndex].lastName + "<span class='ssnDefaultView'>" + courses[courseIndex].students[subIndex].ssn + "</span></a>";
                        } else {
                            item += "<a href='#' class='list-group-item inactiveStudent studentName'>" + sortedByName[subIndex].firstName + " " + courses[courseIndex].students[subIndex].lastName + "<span class='ssnDefaultView'>" + courses[courseIndex].students[subIndex].ssn + "</span></a>";
                        }
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

    // Render course list in courses menu
    Page.renderCourseList = function (courses) {
        var tbody = $("#courseListTable tbody");
        tbody.empty();

        var view = "";

        for (var index = 0; index < courses.length; index++) {
            if (courses[index].active === false) {
                view += "<tr>";
                view += "<td>" + courses[index].name + "</td>";
                view += "<td>" + courses[index].credits + "</td>";
                view += "<td>" + courses[index].students.length + "</td>";
                view += "<td>" + courses[index].year + "</td>";
                view += "<td>" + courses[index].term + "</td>";

                view += "<td><input data-courseId='" + courses[index].id + "' class='aiCheckbox' type='checkbox' checked='' name='courseStatus' value='Course' ><span class='spanInactive'>Inaktiv</span><span data-courseEditId='" + courses[index].id + "' href='#' class='glyphicon glyphicon-edit' title='Klicka här för att redigera kursen.'></span></td>";

                view += "</tr>";
            } else {
                view += "<tr>";
                view += "<td>" + courses[index].name + "</td>";
                view += "<td>" + courses[index].credits + "</td>";
                view += "<td>" + courses[index].students.length + "</td>";
                view += "<td>" + courses[index].year + "</td>";
                view += "<td>" + courses[index].term + "</td>";

                view += "<td><input data-courseId='" + courses[index].id + "' class='aiCheckbox' type='checkbox' name='courseStatus' value='Course' ><span class='spanActive'>Aktiv</span><span data-courseEditId='" + courses[index].id + "' href='#' class='glyphicon glyphicon-edit' title='Klicka här för att redigera kursen.'></span></td>";

                view += "</tr>";
            }
        }

        tbody.append(view);

        configuration.courseListPlaceholder.fadeIn(500);
       
    }

    // Render student list in students menu
    Page.renderStudentList = function (students) {
        var tbody = $("#studentListTable tbody");
        tbody.empty();

        var view = "";                                         

        for (var index = 0; index < students.length; index++) {
            if (students[index].active === false) {
                view += "<tr>";
                view += "<td>" + students[index].firstName + "</td>";
                view += "<td>" + students[index].lastName + "</td>";
                view += "<td>" + students[index].ssn + "</td>";

                view += "<td><input data-studentId='" + students[index].id + "' class='aiCheckbox' type='checkbox' checked='' name='studentStatus' value='Student' ><span class='spanInactive'>Inaktiv</span><span title='Redigera student.' data -editId='" + students[index].id + "' href='#' class='glyphicon glyphicon-edit'></span></td>";

                view += "</tr>";
            } else {
                view += "<tr>";
                view += "<td>" + students[index].firstName + "</td>";
                view += "<td>" + students[index].lastName + "</td>";
                view += "<td>" + students[index].ssn + "</td>";

                view += "<td><input data-studentId='" + students[index].id + "' class='aiCheckbox' type='checkbox' name='studentStatus' value='Student' ><span class='spanActive'>Aktiv</span><span title='Redigera student.' data-editId='" + students[index].id + "' href='#' class='glyphicon glyphicon-edit'></span></td>";

                view += "</tr>";
            }

        }
        tbody.append(view);

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
        $(form["active"]).val(course.active);

        // Set the details panel top header text.
        $(form).find('[name=title]').text(course.name);

        // Render the registered students.
        Page.renderCourseDetailsStudentList(course);

        // Render and fill the student select list.
        Page.renderCourseDetailsStudentSelectList();

        // Display the details panel.
       configuration.courseListPlaceholder.hide();
        configuration.courseDetailsPlaceholder.fadeIn(500);
    }

    //Reder course details studentlist with active/inactive students.
    Page.renderCourseDetailsStudentList = function (course) {
        configuration.courseDetailsStudentListPlaceholder.empty();
        if (course.students.length) {
            for (var index = 0; index < course.students.length; index++) {

                var sortedByName = sortByStudentName(course.students);

                // Show student in list if active
                if (sortedByName[index].active) {

                    configuration.courseDetailsStudentListPlaceholder.append(
                        "<div class='list-group-item registered-student' data-id='"
                        + course.students[index].id
                        + "' data-first-name='"
                        + sortedByName[index].firstName
                        + "' data-last-name='"
                        + course.students[index].lastName
                        + "' data-ssn='"
                        + course.students[index].ssn

                        
                        + "' data-active='"
                        + course.students[index].active

                        + "'>"
                        + course.students[index].firstName
                        + " "
                        + course.students[index].lastName
                        + "<div class='inline-registred-student'> "
                        + "<span class='ssnSpace'>" + course.students[index].ssn + "</span>"

                        // Render the trash can, the remove student button.
                        + "<span class='pull-right'><button class='remove-registered-student btn btn-xs btn-warning'>"
                        + "<span class='glyphicon glyphicon-trash'></span></button></span></div>"

                        + "</div>");
                } else {
                    configuration.courseDetailsStudentListPlaceholder.append(
                        "<div class='list-group-item inactiveStudent registered-student' data-id='"
                        + course.students[index].id
                        + "' data-first-name='"
                        + sortedByName[index].firstName
                        + "' data-last-name='"
                        + course.students[index].lastName
                        + "' data-ssn='"
                        + course.students[index].ssn

                        + "' data-active='"
                        + course.students[index].active

                        + "'>"
                        + course.students[index].firstName
                        + " "
                        + course.students[index].lastName
                        + "<div class='inline-registred-student'> "
                        + "<span class='ssnSpace'>" + course.students[index].ssn + "</span>"

                        // Render the trash can, the remove student button.
                        + "<span class='pull-right'><button class='remove-registered-student btn btn-xs btn-warning'>"
                        + "<span class='glyphicon glyphicon-trash'></span></button></span></div>"

                        + "</div>");
                }
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
            url: configuration.studentsUrl
        }).done(function (data) {
            
            var sortedData = sortByStudentName(data);

            configuration.courseDetailsStudentSelectList.empty();
            $.each(sortedData, function () {
                
                    Page.appendStudentSelectOption(this);   //this as argument?
                
                });

        }).error(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText || textStatus);
        });

    }

    //Append student to ddl in course details
    Page.appendStudentSelectOption = function (student, trigger) {

        var StudentInRegisteredList = null;
        var trashCanEventTrigger = null;
        trashCanEventTrigger = trigger;
        var studentInList = $(".registered-student");
        

        for (var i = 0; i < studentInList.length; i++) {
            var studentId = studentInList[i].getAttribute("data-id");

            studentIdl = student.id.toString();

            if (studentIdl === studentId) {
                
                var StudentInRegisteredList = true;

            }

        }
        
        if (!StudentInRegisteredList || trashCanEventTrigger) {

            var name = student.firstName + " " + student.lastName
                        + "   " + student.ssn;

            configuration.courseDetailsStudentSelectList.append(
               $("<option />")
               .text(name)
               .attr("data-id", student.id)
               .attr("data-first-name", student.firstName)
               .attr("data-last-name", student.lastName)
               .attr("data-ssn", student.ssn)
               .attr("data-active", student.active));

        }
           
            
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
                                
                // Display the default contents.
                Page.displayDefault();
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });

    }

    // Saves a course and does'nt do a view update.
    Page.saveCourseDetails = function (course) {

        course.active = true;

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
        //Page.displayDefault();
    }

    // Adds student to course in course details.
    Page.appendStudentToList = function (student) {

        if (student.id === undefined) {
            alert("OBS!!! Student listan är tom");
        } else {
            if (student.active) {
                configuration.courseDetailsStudentListPlaceholder.append(
                            "<div class='list-group-item registered-student' data-id='"
                            + student.id
                            + "' data-first-name='"
                            + student.firstName
                            + "' data-last-name='"
                            + student.lastName
                            + "' data-ssn='"
                            + student.ssn

                            + "' data-active='"
                            + student.active

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
            } else {
                configuration.courseDetailsStudentListPlaceholder.append(
                            "<div class='list-group-item inactiveStudent registered-student' data-id='"
                            + student.id
                            + "' data-first-name='"
                            + student.firstName
                            + "' data-last-name='"
                            + student.lastName
                            + "' data-ssn='"
                            + student.ssn

                            + "' data-active='"
                            + student.active

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
 
        }
    }

    Page.getCourseTemplate = function () {
        var course = {
            id: 0,
            name: "",
            credits: 0,
            active: true,
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
            active: true
        }

        return student;
    }

    Page.saveStudentDetails = function (student) {

        student.active = true;

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
        var ssn = selectedStudentOption.data("ssn");
        var active = selectedStudentOption.data("active");
        var student = { id: id, firstName: firstName, lastName: lastName, ssn: ssn, active: active }
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

        console.log("Registring student having id " + id + "." + active);
    }

    Page.navigate = function (panel) {
        switch (panel) {
            case "start":
                configuration.courseDetailsPlaceholder.hide();
                configuration.courseListPlaceholder.hide();
                configuration.studentListPlaceholder.hide();
                cleareditStudentBox();

                Page.displayDefault();

                break;
            case "courses":
                configuration.courseDetailsPlaceholder.hide();
                configuration.defaultPlaceholder.hide();
                configuration.studentListPlaceholder.hide();
                cleareditStudentBox();
                $("#addCourse").text('Lägg Till Kurs.');

                Page.displayCourseList();
                configuration.panelBodyPlaceholder.hide();
                break;
            case "students":
                configuration.courseDetailsPlaceholder.hide();
                configuration.defaultPlaceholder.hide();
                configuration.courseListPlaceholder.hide();
                cleareditStudentBox();
                $("#addStudent").text('Lägg Till Student.');

                Page.displayStudentList();
                configuration.studentListFormPlaceholder.hide();

                break;
            default:
                configuration.courseDetailsPlaceholder.hide();
                Page.displayDefault();
                
        }
    }

    Page.deselectMenu = function () {

        $('.navbar li.active').removeClass('active');
        $('.navbar li.startActive').addClass('active');

    }

    Page.displayStudentInEditBox = function (id) {

        $.ajax({
                type: "GET",
                url: configuration.studentsUrl + id
            }).done(function (data) {
                console.log("[Page.displayStudentList]: Number of items returned: " + data.length);

                //var data = {}
                Page.editStudent(data);

            }).error(function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText || textStatus);
            });
        }

    Page.editStudent = function (student) {
       
                //Putting student values in add student form;
                $("input[name$='firstName']").val(student.firstName);
                $("input[name$='lastName']").val(student.lastName);
                $("input[name$='ssn']").val(student.ssn);
                $("input[name$='id']").val(student.id);
                $("input[name$='active']").val(student.active);

    }

    // Changes Student Status Value
    Page.changeStudentStatusValue = function (id, status) {

        $.ajax({
            type: "GET",
            url: configuration.studentsUrl + id
        }).done(function (data) {
            console.log("[Page.displayStudentList]: Number of items returned: " + data.length);

            var student = data;
            student.active = status;

            //debugger;
            Page.saveStudentActiveStatusDetails(student);

        }).error(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText || textStatus);
        });
        
    }

    // Saves Student Active/Inactive Status Details
    Page.saveStudentActiveStatusDetails = function (student) {

        $.ajax({
            url: configuration.studentsUrl,
            type: "POST",
            data: JSON.stringify(student),
            contentType: "application/json",
            success: function (data, textStatus, jqXHR) {
                console.log("[Page.saveStudentActiveDetails.success]: Results: " + data);
                
            Page.displayStudentList();
            cleareditStudentBox();

            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });

    }

    // Changes Course Status Value
    Page.changeCourseStatusValue = function (id ,status) {
        //debugger;
        $.ajax({
            type: "GET",
            url: configuration.coursesUrl + id
        }).done(function (data) {
            console.log("[Page.displayCourseList]: Number of items returned: " + data.length);
            var course = data;
            course.active = status;

            Page.saveCourseActiveStatusDetails(course);

        }).error(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText || textStatus);
        });

    }
    // Saves Course Active/Inactive Status Details
    Page.saveCourseActiveStatusDetails = function (course) {

        $.ajax({
            url: configuration.coursesUrl,
            type: "POST",
            data: JSON.stringify(course),
            contentType: "application/json",
            success: function (data, textStatus, jqXHR) {
                console.log("[Page.saveCourseActiveDetails.success]: Results: " + data);

                Page.displayCourseList();


            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });
    }

    return Page;
}

