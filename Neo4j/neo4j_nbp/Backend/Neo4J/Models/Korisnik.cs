using Microsoft.Extensions.Options;
using System.Collections.Generic;

namespace Neo4J.Models
{
    public class Korisnik
    {
        // Node
        public string ime { get; set; }

        public string prezime { get; set; }

        public string rodjedan { get; set; }

        public string korisnicko_ime { get; set; }

        public string lozinka { get; set; }

        public string email { get; set; }

        public string profilnaSlika { get; set; }

        public TipKorsnika tip { get; set; }

       public Drzava drzava { get; set; }

       public List<Slika> galerija { get; set; }

       public Preference preference { get; set; }
       public Following pracenje { get; set; }
       public bool online { get; set; }   
    }
}
