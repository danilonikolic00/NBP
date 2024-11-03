using MongoDB.Bson;

namespace MongoDB.Models
{
    public class Korisnik
    {
        public ObjectId? id { get; set; }
        public string id_string { get; set; }
        public string ime { get; set; }
        public string prezime { get; set; }
        public string email { get; set; }
        public string lozinka { get; set; }
        public string broj_telefona { get; set; }
        public UserType tip { get; set; }
        public bool online { get; set; }
        public Korpa korpa { get; set; }
    }
}
