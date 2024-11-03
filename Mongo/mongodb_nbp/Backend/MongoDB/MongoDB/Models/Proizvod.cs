using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MongoDB.Models
{
    public class Proizvod
    {
        public ObjectId? id { get; set; }
        public string id_string { get; set; }
        public string ime { get; set; }
        public string opis { get; set; }
        public int cena { get; set; }
        public string slika { get; set; }
        public bool dostupnost { get; set; }
        public string kategorija { get; set; }

    }
}
