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
            panelBodyPlaceholder: $("#panelBodyPlaceholder")
        });

        // Do some page bootstrapping.
        Page.init();

        // Display course details for clicked course.
        $("#defaultPlaceholder").on("click", ".list-item", function (event) {
            var courseDefaultView = null;
            courseDefaultView = $(event.target).hasClass("list-group-addon");
            if (courseDefaultView) {

                var id = $(event.target).data("itemId");
                console.log("[#defaultPlaceholder.click]: Course list clicked: " + id);

                Page.displayCourseDetails(id);
            }
        });

        // Display course details for clicked course from courses menu.
        $("#courseListTable").on("click", ".glyphicon", function (event) {
            var courseDefaultView = null;
            courseDefaultView = $(event.target).hasClass("glyphicon-edit");
            if (courseDefaultView) {

                var id = $(event.target).data("courseeditid");
                console.log("[#defaultPlaceholder.click]: Course list clicked: " + id);

                Page.displayCourseDetails(id);
            }
        });

        // Show / Hide students event
        $("#defaultPlaceholder").on("click",".list-item", function (event) { 
            var courseDefaultView = null;
            courseDefaultView = $(event.target).hasClass("activeCourse");
            if (courseDefaultView) {
                
                var targetClick = $(event.target);
                                
                $(targetClick).siblings("a").slideToggle("slow");

            }
        });

        // Cancel the course details view.
        $("#courseDetailsCancelButton").on("click", function (event) {
            console.log("[#courseDetailsCancelButton.click]: Course details canceled.");

            // De-scelect the top menu button.
            //Page.deselectMenu();

            Page.displayDefault();
        });

        // Save the course details.
        $("#courseDetailsForm").submit(function (event) {
            event.preventDefault();
            console.log("[courseDetailsForm.submit]: Submitted course details form.");

            var course = Utilities.formToJson(this);
            course.students = [];

            var student = null;
            $(".registered-student").each(function () {
                student = {
                    id: $(this).data("id"),
                    firstName: $(this).data("firstName"),
                    lastName: $(this).data("lastName"),
                    ssn: $(this).data("ssn"),
                    active: $(this).data("active")
                }
                course.students.push(student);
            });

            Page.saveCourseAndDisplayDefault(course);
        });

        // Save the student details.
        $("#studentListForm").submit(function (event) {
            event.preventDefault();
            console.log("[studentDetailsForm.submit]: Submitted course details form.");

            var student = Utilities.formToJson(this);
            
            //debugger;

            Page.saveStudentDetails(student);
        });
        
        // Remove a registered student from course and adds it to ddl
        $("#courseDetailsStudentListPlaceholder").on("click", ".remove-registered-student", function (event) {
            var item = $(this).closest(".list-group-item")[0];

            // Append to the option list.
            var id = $(item).data("id");
            var firstName = $(item).data("firstName");
            var lastName = $(item).data("lastName");
            var ssn = $(item).data("ssn");
            var active = $(item).data("active");
            var student = { id: id, firstName: firstName, lastName: lastName, ssn: ssn, active: active}

           Page.appendStudentSelectOption(student, true);
           
            // Remove from the registered list.
            $(item).remove();
        });

        // Register a student.
        $("#registerSelectedStudentButton").on('click', function (event) {

            Page.registerSelectedStudent();

        });

        $('.nav li').click(function (e) {
            $('.navbar li.active').removeClass('active');
            var $this = $(this);

            if (!$this.hasClass('active')) {
                $this.addClass('active');
            }

            e.preventDefault();
        });

        $(".navbar-brand").click(function (e) {
            $('.navbar li.active').removeClass('active');
            $('.nav li a[href="#start"]').parent().addClass('active');
                        
        });

        $(".navigation").on("click", function () {
            var panel = this.href.substr(this.href.indexOf("#") + 1);

            console.log(panel);

            Page.navigate(panel);
        });

        // Save the new course details from the course list view.
        $("#courseListAddCourseForm").submit(function (event) {
            event.preventDefault();
            console.log("[courseListAddCourseForm.submit]: Submitted the new course form.");

            var course = Utilities.formToJson(this);
            course.students = [];
            $(this)[0].reset();

            Page.saveCourseDetails(course);
        });

        $(document).on("courseSavedCustomEvent", function (event) {
            console.log("[courseSavedCustomEvent]: " + event.message.description);
            console.log("[courseSavedCustomEvent]: " + event.message.data);

            Page.displayCourseList();

        });

        $(document).on("studentSavedCustomEvent", function (event) {
            console.log("[studentSavedCustomEvent]: " + event.message.description);
            console.log("[studentSavedCustomEvent]: " + event.message.data);

            Page.displayStudentList();

            cleareditStudentBox();
            
        });


        // Checkbox event student status Active/Inactive
        $("#studentTbody").on("change", function (event) {

           var studentId = $(event.target).data("studentid");
            //debugger;
            var check = null;
            check = $(event.target).is(":checked");

            if (check === true) {
                console.log("Checked " + studentId);
                var span = $(event.target.nextElementSibling);
                span.text("Inaktiv");
                span.removeClass("spanActive");
                span.addClass("spanInactive");
               
                var status = false;
                Page.changeStudentStatusValue(studentId, status);
                

            } else {

                console.log("Unchecked " + studentId);
                var span = $(event.target.nextElementSibling);
                span.text("Aktiv");
                span.removeClass("spanInactive");
                span.addClass("spanActive");
                
                var status = true;
                Page.changeStudentStatusValue(studentId, status);
                
            };
            
        });

        // Edit student event
        $("#studentTbody").on("click", function (event) {
            
            var clickedId = $(event.target).data("editid");

            var editClick = null;

            editClick = $(event.target).hasClass("glyphicon-edit");
            
            if (editClick === true) {

                console.log("Clicked Id " + clickedId);
                
                Page.displayStudentInEditBox(clickedId);
                
                //debugger;
            } else {

                console.log("Missed");
                
            };
        });

        // Checkbox event student status Active/Inactive
        $("#courseTbody").on("change", function (event) {

            var courseId = $(event.target).data("courseid");
            //debugger;
            var check = null;
            check = $(event.target).is(":checked");

            if (check === true) {
                console.log("Checked " + courseId);
                var span = $(event.target.nextElementSibling);
                span.text("Inaktiv");
                span.removeClass("spanActive");
                span.addClass("spanInactive");

                var status = false;
                Page.changeCourseStatusValue(courseId, status);


            } else {

                console.log("Unchecked " + courseId);
                var span = $(event.target.nextElementSibling);
                span.text("Aktiv");
                span.removeClass("spanInactive");
                span.addClass("spanActive");

                var status = true;
                Page.changeCourseStatusValue(courseId, status);

            };

        });
        
        $("#addCourse").on("click", function () {
           
            var txt = $("#panelBodyPlaceholder").is(':visible') ? 'Lägg Till Kurs.' : 'Dölj Lägg Till Kurs.';
            $("#addCourse").text(txt);
             $("#panelBodyPlaceholder").slideToggle("slow");
        });

    });






   
        

        
    

