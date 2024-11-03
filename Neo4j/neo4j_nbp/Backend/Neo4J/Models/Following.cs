using System.Collections.Generic;
using System.Security.Permissions;

namespace Neo4J.Models
{
    public class Following
    {
        // Veza
        public List<Korisnik> prati { get; set; }
        public Korisnik Korisnik { get; set; }

    }
}
