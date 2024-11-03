namespace MongoDBServer.Models
{
    public class DatabaseSettings : IDatabaseSettings
    {
      public string KategorijaCollectionName { get; set; }
      public string KorisnikCollectionName { get; set; }
      public string KorpaCollectionName { get; set; }
      public string ProdavicaCollectionName { get; set; }
      public string ProizvodCollectionName { get; set; }
      public string NarudzbinaCollectionName { get; set; }
      public string ConnectionString { get; set; }
      public string DatabaseName { get; set; }
    }

    public interface IDatabaseSettings
    {
        string KategorijaCollectionName { get; set; }
        string KorisnikCollectionName { get; set; }
        string KorpaCollectionName { get; set; }
        string ProdavicaCollectionName { get; set; }
        string ProizvodCollectionName { get; set; }
        string NarudzbinaCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}

