using MongoDB.Driver;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MongoDB.Models
{
    public class Prodavnica
    {
        public ObjectId? id { get; set; }
        public string string_id { get; set; }
        public string ime { get; set; }
        public string email { get; set; }
        public string broj_telefona { get; set; }
        public string adresa { get; set; }
        public bool online { get; set; }
        public string lozinka {get; set;}
        public Kategorija katerogija { get; set; }
        public string string_kategorija {get; set;}
        public float ocena { get; set; }
        public int broj_ocena { get; set; }
        public string slika { get; set; }
        public List<string> ocenjivaci { get; set; }
        public List<Proizvod> proizvodi { get; set; }
    }
}
