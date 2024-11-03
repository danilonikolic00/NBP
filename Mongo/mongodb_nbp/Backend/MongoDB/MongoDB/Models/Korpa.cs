using MongoDB.Bson;
using System.Collections.Generic;

namespace MongoDB.Models
{
    public class Korpa
    {
        public ObjectId? id { get; set; }
        public string string_id { get; set; }
        public List<Proizvod> proizvodi { get; set; }
    }
}
