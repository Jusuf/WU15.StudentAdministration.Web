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
    public class SearchStudentsController : ApiController
    {
        private DefaultDataContext db = new DefaultDataContext();

        [HttpGet]
        [Route("api/searchStudents/{query}")]       
        public IEnumerable<Student> Get(string query)
        {
            var results = db.Students
                .Include(y => y.Courses).Where(x => x.FirstName.Contains(query)
                || x.LastName.Contains(query)
                || x.Ssn.Contains(query));

            return results;
        }
    }
}
