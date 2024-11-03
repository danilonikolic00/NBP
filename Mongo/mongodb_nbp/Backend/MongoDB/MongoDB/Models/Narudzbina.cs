using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace MongoDB.Models
{
    public class Narudzbina
    {
        public ObjectId id { get; set; }
        public string id_string { get; set; }
        public Korisnik klijent { get; set; }
        public List<Proizvod> proizvodi { get; set; }
        public float cena { get; set; }
        [BsonRepresentation(BsonType.String)]
        public Status status { get; set; }
        public DateTime vreme { get; set; }
    }
}
