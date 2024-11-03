using System.Collections.Generic;

namespace Neo4J.Models
{
    public class Preference
    {
        // Node
        public string korisnicko_ime { get; set; }    
        public List<Tag> tagovi { get; set; }

        public Drzava drzava { get; set; }

        public Region region { get; set; }

        public Following prati { get; set; }    

    }
}
