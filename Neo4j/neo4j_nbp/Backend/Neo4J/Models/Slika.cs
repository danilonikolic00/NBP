using System;
using System.Collections.Generic;
using System.Security.Principal;

namespace Neo4J.Models
{
    public class Slika
    {
        // Node
        public string lokacija { get; set; }
        public int broj_komentara { get; set; }
        public int broj_lajkova { get; set; }
        public List<Tag> tag { get; set; }

        public Korisnik Korisnik { get; set; }

        public List<Komentar> komentari { get; set; }
        public List<Like> likeovi { get; set; }

        public DateTime datum_objave { get; set; }

        public Drzava drzava { get; set; }

        public Region region { get; set; }
    }
}
