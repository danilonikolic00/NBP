namespace Neo4J.Models
{
    public class Komentar
    {
        // Veza
        public string tekst { get; set; }
        public Slika slika { get; set; }
        public Korisnik salje { get; set; }
    }
}
