using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WU15.StudentAdministration.Web.Models;

namespace WU15.StudentAdministration.Web.API
{
    public class StudentsController : ApiController
    {
        public IEnumerable<Student> Get()
        {            
            return MvcApplication.Students;
        }

        public Student Get(int id)
        {
            return MvcApplication.Students.FirstOrDefault(x => x.Id == id);
        }

        public string Post(Student student)
        {
            if (student.Id == 0)
            {
                var id = MvcApplication.Students.Max(x => x.Id) + 1;
                student.Id = id;
            }
            MvcApplication.Students.Add(student);

            return string.Format("{0} {1}", student.FirstName, student.LastName);       
        }

        [HttpDelete]
        public void Delete(int id)
        {
            var student = MvcApplication.Students.FirstOrDefault(x => x.Id == id);
            MvcApplication.Students.Remove(student);
        }
    }
}
