using System.Collections.Generic;

namespace Neo4J.Models
{
    public class Region
    {
        // Node
        public string naziv { get; set; }
        public List<Drzava> drzave { get; set; }
    }
}
