using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WU15.StudentAdministration.Web.DataAccess;
using WU15.StudentAdministration.Web.Models;


namespace WU15.StudentAdministration.Web.API
{
    public class StudentsController : ApiController
    {
        private DefaultDataContext db = new DefaultDataContext();

        public IEnumerable<Student> Get()
        {
            var students = db.Students.Include("Courses").OrderBy(x => x.FirstName);

            return students;
        }

        public Student Get(int id)
        {
            return db.Students.FirstOrDefault(x => x.Id == id);
        }
        
        public string Post(Student student)
        {
            if (student.Id > 0) // Save
            {
                db.Entry(student).State = EntityState.Modified;
            }
            else // Add
            {
                db.Students.Add(student);
            }
            
            db.SaveChanges();

            return string.Format("{0} {1}", student.FirstName, student.LastName);
        }
    }
}

  
