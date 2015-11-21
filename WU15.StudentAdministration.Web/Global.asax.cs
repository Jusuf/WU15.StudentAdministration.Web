using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http.Formatting;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Newtonsoft.Json.Serialization;
using WU15.StudentAdministration.Web.API;
using WU15.StudentAdministration.Web.Handlers;
using WU15.StudentAdministration.Web.Models;

namespace WU15.StudentAdministration.Web
{
    public class MvcApplication : System.Web.HttpApplication
    {
        public static List<Course> Courses = null;
        public static List<Student> Students = null;

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            GlobalConfiguration.Configuration.Formatters.Clear();
            GlobalConfiguration.Configuration.Formatters.Add(new JsonMediaTypeFormatter());

            var json = GlobalConfiguration.Configuration.Formatters.JsonFormatter;
            json.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            GlobalConfiguration.Configuration.MessageHandlers.Add(new XHttpMethodOverrideDelegatingHandler());

            Courses = new List<Course>();
            Students = new List<Student>();
            LoadStudents();
            LoadCourses();
        }

        private static void LoadCourses()
        {
            var course = new Course()
            {
                Id = 1,
                Students = Students,
                SchoolNo = "c08bdab7-ed3d-4048-8338-d4f14f2770a8",
                Credits = "15",
                Name = "Pedagogik 1",
                Term = "VT",
                Year = "2015",
                Active = true
            };
            Courses.Add(course);

            course = new Course()
            {
                Id = 2,
                SchoolNo = "c08bdab7-ed3d-4048-8338-d4f14f2770a8",
                Credits = "10",
                Name = "Pedagogik 2",
                Term = "VT",
                Year = "2015",
                Active = true
            };
            Courses.Add(course);

            course = new Course()
            {
                Id = 3,
                SchoolNo = "c08bdab7-ed3d-4048-8338-d4f14f2770a8",
                Credits = "5",
                Name = "Datalogi 1",
                Term = "VT",
                Year = "2015",
                Active = true
            };
            Courses.Add(course);

            course = new Course()
            {
                Id = 4,
                SchoolNo = "c08bdab7-ed3d-4048-8338-d4f14f2770a8",
                Credits = "7,5",
                Name = "Filosofi 1",
                Term = "VT",
                Year = "2015",
                Active = true
            };
            Courses.Add(course);
        }
        
        private static void LoadStudents()
        {
            var student = new Student
            {
                Id = 1,
                FirstName = "Kalle",
                LastName = "Bengtsson",
                Ssn = "800224 - 0121",
                Active = true
            };
            Students.Add(student);

            student = new Student
            {
                Id = 2,
                FirstName = "Eva",
                LastName = "Andersson",
                Ssn = "840224 - 3321",
                Active = true
            };
            Students.Add(student);

            student = new Student
            {
                Id = 3,
                FirstName = "Ylva",
                LastName = "Nordsson",
                Ssn = "600314 - 2121",
                Active = true
            };
            Students.Add(student);

            student = new Student
            {
                Id = 4,
                FirstName = "Evy",
                LastName = "Carlsson",
                Ssn = "830211 - 6851",
                Active = true
            };
            Students.Add(student);

            student = new Student
            {
                Id = 5,
                FirstName = "Lisa",
                LastName = "Olofsson",
                Ssn = "890921 - 0001",
                Active = true
            };
            Students.Add(student);

            student = new Student
            {
                Id = 6,
                FirstName = "Robert",
                LastName = "Tovek",
                Ssn = "900714 - 6541",
                Active = true
            };
            Students.Add(student);
        }
    }
}
