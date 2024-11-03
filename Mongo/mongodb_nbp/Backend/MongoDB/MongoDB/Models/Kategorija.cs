using MongoDB.Bson;

namespace MongoDB.Models
{
    public class Kategorija
    {
        public ObjectId? id { get; set; }
        public string id_string { get; set; }
        public string ime { get; set; }
    }
}
