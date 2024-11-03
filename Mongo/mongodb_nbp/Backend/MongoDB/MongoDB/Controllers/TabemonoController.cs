using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Microsoft.Win32.SafeHandles;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Any;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Models;
using MongoDBServer.Models;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using static System.Net.Mime.MediaTypeNames;
using Microsoft.VisualBasic;
using System.Collections.ObjectModel;
using System.Collections;

namespace MongoDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TabemonoController : ControllerBase
    {
        private readonly ILogger<TabemonoController> _logger;
        private readonly MongoClient client;
        private readonly IMongoDatabase database;
        private readonly IMongoCollection<Proizvod> proizvodi;
        private readonly IMongoCollection<Kategorija> kategorije;
        private readonly IMongoCollection<Korisnik> korisnik;
        private readonly IMongoCollection<Prodavnica> prodavnica;
        private readonly IMongoCollection<Narudzbina> narudzbine;
        private readonly IMongoCollection<Korpa> korpa;

        public TabemonoController(ILogger<TabemonoController> logger, IDatabaseSettings settings)
        {
            _logger = logger;
            client = new MongoClient(settings.ConnectionString);
            database = client.GetDatabase(settings.DatabaseName);
            proizvodi = database.GetCollection<Proizvod>(settings.ProizvodCollectionName);
            kategorije = database.GetCollection<Kategorija>(settings.KategorijaCollectionName);
            korisnik = database.GetCollection<Korisnik>(settings.KorisnikCollectionName);
            prodavnica = database.GetCollection<Prodavnica>(settings.ProdavicaCollectionName);
            narudzbine = database.GetCollection<Narudzbina>(settings.NarudzbinaCollectionName);
            korpa = database.GetCollection<Korpa>(settings.KorpaCollectionName);
        }

        [HttpPost]
        [Route("Registracija/{ime}/{prezime}/{email}/{lozinka}/{broj_telefona}")]
        public async Task<bool> RegistracijaAsync(string ime, string prezime, string email, string lozinka, string broj_telefona)
        {
            Korisnik Novi = new Korisnik();
            Novi.id = ObjectId.GenerateNewId();
            Novi.id_string = Novi.id.ToString();
            Novi.lozinka = lozinka;
            Novi.email = email.ToLower();
            Novi.online = false;
            Novi.tip = UserType.klijent;

            Korpa Newkorpa = new Korpa();
            Newkorpa.id = ObjectId.GenerateNewId();
            Newkorpa.string_id = Newkorpa.id.ToString();
            Newkorpa.proizvodi = new List<Proizvod>();
            korpa.InsertOne(Newkorpa);

            Novi.korpa = Newkorpa;
            Novi.ime = ime;
            Novi.prezime = prezime;
            Novi.broj_telefona = broj_telefona;


            var ExistingUser = await korisnik.Find(k => k.email == email).FirstOrDefaultAsync();

            if (ExistingUser == null)
            {
                korisnik.InsertOne(Novi);
                return true;
            }
            else
                return false;

        }

        [HttpPost]
        [Route("RegisterAdmin/{email}/{lozinka}")]
        public async Task<bool> RegisterAdmin(string email,string lozinka)
        {
            Korisnik Novi = new Korisnik();
            Novi.id = ObjectId.GenerateNewId();
            Novi.id_string = Novi.id.ToString();
            Novi.lozinka = lozinka;
            Novi.email = email.ToLower();
            Novi.online = false;
            Novi.tip = UserType.admin;

            var ExistingUser = await korisnik.Find(k => k.email == Novi.email).FirstOrDefaultAsync();

            if (ExistingUser == null)
            {
                korisnik.InsertOne(Novi);
                return true;
            }
            else
                return false;

        }


        [HttpPut]
        [Route("login/{email}/{lozinka}")]
        public async Task<string> login(string email, string lozinka)
        {
            email = email.ToLower();
            var ExistingUser = await korisnik.Find(k => k.email == email).FirstOrDefaultAsync();

            if (ExistingUser != null && ExistingUser.lozinka == lozinka)
            {
                korisnik.UpdateOne(p => p.email == email, MongoDB.Driver.Builders<Korisnik>.Update.Set("online", true));
                return ExistingUser.id_string.ToJson();
            }
            else if (ExistingUser == null)
            {
                var ExistingShop = await prodavnica.Find(k => k.email == email).FirstOrDefaultAsync();
                if(ExistingShop != null)
                prodavnica.UpdateOne(p => p.email == email, MongoDB.Driver.Builders<Prodavnica>.Update.Set("online", true));
                return ExistingShop.string_id.ToJson();
            }
            else
                return "";
        }

        [HttpPut]
        [Route("logout/{id}")]
        public async Task<bool> logout(string id)
        {
            var ExistingUser = await korisnik.Find(k => k.id_string == id).FirstOrDefaultAsync();

            if (ExistingUser != null)
            {
                korisnik.UpdateOne(p => p.id_string == id, MongoDB.Driver.Builders<Korisnik>.Update.Set("online", false));
                return true;
            }
            else if (ExistingUser == null)
            {
                var ExistingShop = await prodavnica.Find(k => k.string_id == id).FirstOrDefaultAsync();
                if (ExistingShop != null)
                {
                    prodavnica.UpdateOne(p => p.string_id == id, MongoDB.Driver.Builders<Prodavnica>.Update.Set("online", false));
                    return true;
                }
            }
                return false;
        }


        [HttpGet]
        [Route("VratiTip/{id}")]
        public async Task<UserType> VratiTip(string id)
        {
            var objId = new ObjectId(id);
            var ExistingUser = await korisnik.Find(k => k.id == objId).FirstOrDefaultAsync();
            if (ExistingUser != null)          
                return ExistingUser.tip;
            else if (ExistingUser == null && id != "")
            {
                var ExistingShop = await prodavnica.Find(k => k.id == objId).FirstOrDefaultAsync();
                if (ExistingShop != null)
                    return UserType.prodavnica;

            }    
                return UserType.none;
        }

        [HttpPost]
        [Route("IzmeniProfil/{id}/{ime}/{prezime}/{lozinka}/{broj_telefona}")]
        public async Task<bool> IzmeniProfil(string id, string ime, string prezime, string lozinka, string broj_telefona)
        {
            var ExistingUser = await korisnik.Find(k => k.id_string == id).FirstOrDefaultAsync();          
            if (ExistingUser != null)
            {
                korisnik.UpdateOne(k => k.id_string == id, MongoDB.Driver.Builders<Korisnik>.Update.Set("ime", ime));
                korisnik.UpdateOne(k => k.id_string == id, MongoDB.Driver.Builders<Korisnik>.Update.Set("prezime", prezime));
                if (lozinka != "null")
                    korisnik.UpdateOne(k => k.id_string == id, MongoDB.Driver.Builders<Korisnik>.Update.Set("lozinka", lozinka));
                korisnik.UpdateOne(k => k.id_string == id, MongoDB.Driver.Builders<Korisnik>.Update.Set("broj_telefona", broj_telefona));
                return true;
            }
            else
                return false;
        }

        [HttpPut]
        [Route("IzmeniProfilShop/{id}/{ime}/{broj_telefona}/{adresa}/{lozinka}/{kategorija}")]
        public async Task<bool> IzmeniProfilShop(string id, string ime, string adresa, string broj_telefona, string lozinka,string kategorija)
        {
   
            var ExistingUser = await prodavnica.Find(k => k.string_id == id).FirstOrDefaultAsync();
            if (ExistingUser != null)
            {               
                var ExistingKategorija = await kategorije.Find(k => k.ime == kategorija).FirstOrDefaultAsync();
                var editProdavnica = ExistingUser;
                if (ime != "")
                    editProdavnica.ime = ime;                              
                if (adresa != "")
                    editProdavnica.adresa = adresa;
                if (lozinka != "null")
                    editProdavnica.lozinka = lozinka;
                editProdavnica.broj_telefona = broj_telefona; 

                if (ExistingKategorija != null)
                    editProdavnica.katerogija = ExistingKategorija;

                var filter = Builders<Prodavnica>.Filter.Eq(p => p.string_id, id);
                var result = await prodavnica.ReplaceOneAsync(filter, editProdavnica);
                
                return true;
            }
            else
                return false;
        }

        [HttpGet]
        [Route("GetProfilKlijenta/{id}")]
        public async Task<Korisnik> GetProfilKlijenta(string id)
        {
            var ExistingUser = await korisnik.Find(k => k.id_string == id).FirstOrDefaultAsync();
            if (ExistingUser != null)
            {
                ExistingUser.lozinka = null;
                return ExistingUser;
            }
            else
                return null;
        }

        [HttpGet]
        [Route("GetProfilProdavnice/{id}")]
        public async Task<Prodavnica> GetProfilShop(string id)
        {
            var ExistingUser = await prodavnica.Find(k => k.string_id == id).FirstOrDefaultAsync();
            if (ExistingUser != null)
            {
                ExistingUser.lozinka = null;
                return ExistingUser;
            }
            else
                return null;
        }


        [HttpPost]
        [Route("DodajProizvod/{ime}/{cena}/{opis}/{kategorija}/{id_prodavnice}")]
        public async Task<string> DodajProizvod(string ime, int cena,string opis,string id_prodavnice,string kategorija)
        {
            var obj = new ObjectId(id_prodavnice);
            var prodavnica_ = await prodavnica.Find(pr => pr.id == obj).FirstOrDefaultAsync();

            Proizvod p = new Proizvod();
            p.ime = ime;
            p.cena = cena;
            p.opis = opis;
            p.id = ObjectId.GenerateNewId();
            p.id_string = p.id.ToString();
            p.kategorija = kategorija;
            p.dostupnost = true;

            if (prodavnica_ == null)
                return "Ne postoji prodavnica";

            List<Proizvod> lista = prodavnica_.proizvodi;
            foreach(Proizvod proizvod_ in lista)
            {
                if (p.ime == proizvod_.ime)
                    return "Proizvod sa datim imenom vec postoji u prodavnici";
            }

            if (p.cena <= 0)
                return "Unesite validnu cenu proizvoda!";

            proizvodi.InsertOne(p);
            prodavnica.UpdateOne(p => p.id == obj, MongoDB.Driver.Builders<Prodavnica>.Update.AddToSet("proizvodi", p));

            return "Uspesno dodat proizvod";

        }

        [HttpDelete]
        [Route("ObrisiProizvod/{id}")]
        public  string ObrisiProizvod(string id)
        {
            var obj = new ObjectId(id);
            proizvodi.DeleteOne(x => x.id == obj);

            var filter =Builders<Prodavnica>.Filter.Where(x => x.proizvodi.Any(y => y.id == obj));
            var update = Builders<Prodavnica>.Update.PullFilter(x => x.proizvodi, y => y.id == obj);
            prodavnica.UpdateOne(filter, update);

            return "Uspesno brisanje proizvoda";

        }

        [HttpPut]
        [Route("IzmeniProizvod/{ime}/{cena}/{opis}/{dostupnost}/{kategorija}/{id}")]
        public async Task<string> IzmeniProizvod(string ime, int cena, string opis, bool dostupnost, string kategorija, string id)
        { 
            var objectID = new ObjectId(id);
            var proizvod = await proizvodi.Find(pr => pr.id == objectID).FirstOrDefaultAsync();

            if (proizvod == null)
                return "Ne postoji dati proizvod";

            Proizvod saIzmenama = new Proizvod();
            saIzmenama.id = new ObjectId(id);
            saIzmenama.id_string = saIzmenama.id.ToString();
            saIzmenama.ime = ime;
            var filter_ = Builders<Prodavnica>.Filter.Where(x => x.proizvodi.Any(y => y.id == objectID));
            Prodavnica prod = prodavnica.Find(filter_).FirstOrDefault();

            foreach (Proizvod p in prod.proizvodi)
            {
                if (ime == p.ime && ime!=proizvod.ime)
                    return "Vec postoji proizvod sa ovim imenom";
            }

            saIzmenama.dostupnost = dostupnost;
            saIzmenama.opis = opis;
            saIzmenama.cena = cena;

            if (saIzmenama.cena <= 0)
                return "Cena nije validna";

            saIzmenama.slika = proizvod.slika;
            saIzmenama.kategorija = kategorija;

            var filter = Builders<Proizvod>.Filter.Eq(p => p.id, objectID);
            var result = await proizvodi.ReplaceOneAsync(filter, saIzmenama);

            var filter_P = Builders<Prodavnica>.Filter.Where(x => x.proizvodi.Any(y => y.id == objectID));
            var update_P = Builders<Prodavnica>.Update.Set("proizvodi.$", saIzmenama);
            prodavnica.UpdateOne(filter_P, update_P);

            return "Izmenjen proizvod";
        }

        [HttpPut]
        [Route("DodajKategorijuProizvodu/{id}/{nova_kategorija}")]
        public async Task<string> DodajKategoriju(string id, string nova_kategorija)
        {
           var objectID = new ObjectId(id);
           var proizvod = await proizvodi.Find(pr => pr.id == objectID).FirstOrDefaultAsync();
           if (proizvod == null)
               return "Ne postoji dati proizvod";
           proizvod.kategorija = nova_kategorija;

           proizvodi.UpdateOne(p => p.id == objectID, MongoDB.Driver.Builders<Proizvod>.Update.Set("kategorija", nova_kategorija));
           var filter_P = Builders<Prodavnica>.Filter.Where(x => x.proizvodi.Any(y => y.id == objectID));
           var update_P = Builders<Prodavnica>.Update.Set("proizvodi.$", proizvod);
           prodavnica.UpdateOne(filter_P, update_P);
           return "Uspesno dodata kategorija";
        }

        [HttpPut]
        [Route("PromeniDostupnost/{id_proizvoda}")]
        public async Task<string> PromeniDostupnost(string id_proizvoda)
        {
           var objectID = new ObjectId(id_proizvoda);
           var proizvod = await proizvodi.Find(pr => pr.id == objectID).FirstOrDefaultAsync();
           if (proizvod == null)
               return "Ne postoji dati proizvod";
           proizvod.dostupnost = !proizvod.dostupnost;

           proizvodi.UpdateOne(p => p.id == objectID, MongoDB.Driver.Builders<Proizvod>.Update.Set("dostupnost", proizvod.dostupnost));
           var filter_P = Builders<Prodavnica>.Filter.Where(x => x.proizvodi.Any(y => y.id == objectID));
           var update_P = Builders<Prodavnica>.Update.Set("proizvodi.$", proizvod);
           prodavnica.UpdateOne(filter_P, update_P);
           return "Uspesno";
        }

        [HttpPost]
        [Route("DodajKategoriju/{ime}")]
        public string DodajNovuKategoriju(string ime)
        {
            Kategorija nova = new Kategorija();
            nova.id = ObjectId.GenerateNewId();
            nova.ime = ime;
            nova.id_string = nova.id.ToString();

            Kategorija k = kategorije.Find(kat => kat.ime == nova.ime).FirstOrDefault();
            if (k != null)
                return "Vec postoji kategorija sa datim imenom";
            kategorije.InsertOne(nova);
            return "Uspesno dodavanje kategorije";
        }

        [HttpDelete]
        [Route("ObrisiKategoriju/{id}")]
        public async Task<string> ObrisiKategorijuAsync(string id)
        {
            var obj = new ObjectId(id);
            var kategorija_ = await kategorije.Find(kat => kat.id_string == id).FirstOrDefaultAsync();
            if (kategorija_ == null)
                return "Ne postoji data kategorija";

            List<Prodavnica> prodavnice_ = prodavnica.Find(p => p.katerogija.id_string == kategorija_.id_string).ToList();
            foreach (Prodavnica p in prodavnice_)
            {
                p.katerogija.id = null;
                p.katerogija.id_string = null;
                p.katerogija.ime = null;
                var filter = Builders<Prodavnica>.Filter.Eq(pr => pr.id, p.id);
                var result = await prodavnica.ReplaceOneAsync(filter, p);
            }

            kategorije.DeleteOne(x => x.id == obj);

            return "Uspesno brisanje kategorije";
        }
 

        [HttpPut]
        [Route("IzmeniKategoriju/{ime}/{id}")]
        public async Task<string> IzmeniKategoriju(string ime,string id)
        {
            var objectID = new ObjectId(id);
            var kategorija_ = await kategorije.Find(pr => pr.id == objectID).FirstOrDefaultAsync();
            if (kategorija_ == null)
                return "Ne postoji data kategorija";

            Kategorija saIzmenama = new Kategorija();
            saIzmenama.id = new ObjectId(id);
            saIzmenama.id_string = saIzmenama.id.ToString();
            saIzmenama.ime = ime;

            var filter = Builders<Kategorija>.Filter.Eq(p => p.id, objectID);
            var result = await kategorije.ReplaceOneAsync(filter, saIzmenama);

            var filter_P = Builders<Prodavnica>.Filter.Where(x => x.katerogija.id == saIzmenama.id);
            var update_P = Builders<Prodavnica>.Update
                                        .Set(x => x.katerogija.ime, saIzmenama.ime);
            await prodavnica.UpdateOneAsync(filter_P, update_P);

            return "Izmenjena kategorija";
        }

        [HttpDelete]
        [Route("ObrisiNarudzbinu/{id}")]
        public async Task<string> ObrisiNarudzbinu(string id)
        {
           var obj = new ObjectId(id);
           var narudzbina = await narudzbine.Find(n => n.id == obj).FirstOrDefaultAsync();
           if (narudzbina == null)
               return "Narudzbina ne postoji";
           narudzbine.DeleteOne(n => n.id == narudzbina.id);
           return "Uspesno";
        }

        [HttpPut]
        [Route("izmeniStatusNarudzbine/{idNarudzbine}")]
        public async Task<string> izmeniStatusNarudzbine(string idNarudzbine)
        {
           var objectId = new ObjectId(idNarudzbine);
           var nar = await narudzbine.Find(n => n.id == objectId).FirstOrDefaultAsync();
           if (nar == null)
               return "Nevalidna narudzbina";
           if (nar.status == Status.poruceno)
               nar.status = Status.dostavljeno;
           else
               return "Narudzbina je vec dostavljena";
           narudzbine.UpdateOne(n => n.id == objectId, MongoDB.Driver.Builders<Narudzbina>.Update.Set("status", nar.status));
           return "Izmenjen status narudzbine";
        }

       [HttpGet]
       [Route("vratiNarudzbine/{email}")]
       public async Task<List<Narudzbina>> vratiNarudzbine(string email)
        {
            var klijent = await korisnik.Find(k => k.email == email).FirstOrDefaultAsync();
            if (klijent == null)
                return null;
            List<Narudzbina> listaNarudzbina = await narudzbine.Find(n => n.klijent == klijent).ToListAsync();
            return listaNarudzbina;
        }

        [HttpGet]
        [Route("vratiNarudzbineKlijenta/{id}")]
        public async Task<List<Narudzbina>> vratiNarudzbineKlijenta(string id)
        {
            var klijent = await korisnik.Find(k => k.id_string == id).FirstOrDefaultAsync();
            if (klijent == null)
                return null;
            List<Narudzbina> listaNarudzbina = await narudzbine.Find(n => n.klijent == klijent).ToListAsync();
            return listaNarudzbina;
        }

        [HttpGet]
        [Route("VratiKategorije")]
        public  Kategorija[] VratiKategorije()
        {
            var katList = kategorije.Find(p => p.id != null).ToList().ToArray();
            return katList;
        }

        [HttpPost]
        [Route("DodajProdavnicu/{ime}/{email}/{broj}/{adresa}/{lozinka}/{kategorija}")]
        public bool DodajProdavnicu(string ime, string email, string broj, string adresa, string lozinka,string kategorija)
        {
            var ExShop = prodavnica.Find(s => s.email == email).FirstOrDefault();
            var ExKorisnik = korisnik.Find(s => s.email == email).FirstOrDefault();
            if (ExShop != null || ExKorisnik != null)
                return false;
   
            Prodavnica p = new Prodavnica();
            p.id = ObjectId.GenerateNewId();
            p.string_id = p.id.ToString();
            p.ime = ime;
            p.email = email.ToLower();
            p.broj_telefona = broj;
            p.adresa = adresa;  
            p.lozinka= lozinka;
            p.string_kategorija=kategorija;
            p.ocenjivaci = new List<string>();
            p.proizvodi = new List<Proizvod>();

            var k = kategorije.Find(s => s.ime == kategorija).FirstOrDefault();

            if (k == null)
            {
                Kategorija nova = new Kategorija();
                nova.id = ObjectId.GenerateNewId();
                nova.id_string = nova.id.ToString();
                nova.ime = kategorija;
                kategorije.InsertOne(nova);
                p.katerogija = nova;
            }
            else if (k != null)
            {
                p.katerogija = k;
            }

            if (p.slika == null)
            {
                p.slika = "";
            }

            prodavnica.InsertOne(p);
            return true;
        }

        [HttpGet]
        [Route("VratiSveProdavnice")]
        public  Prodavnica[] VratiSveProdavnice()
        { 
            return prodavnica.Find(p => p.id != null).ToList().ToArray();
        }

        [HttpDelete]
        [Route("ObrisiProdavnicu/{id}")]
        public bool ObrisiProdavnicu([FromRoute] string id)
        {
            var obj = new ObjectId(id);

            prodavnica.DeleteOne(x => x.id == obj);

            return true;

        }

        [HttpPut]
        [Route("IzmeniProdavnicu/{id}/{ime}/{adresa}/{broj_telefona}/{lozinka}/{kategorija}")]
        public async Task<bool> IzmeniProdavnicu(string id,string ime,string broj_telefona,string adresa,string lozinka, string kategorija)
        {
            var objectID = new ObjectId(id);
            var prod = await prodavnica.Find(pr => pr.id == objectID).FirstOrDefaultAsync();
            var kat = await kategorije.Find(pr => pr.ime == kategorija).FirstOrDefaultAsync();

            Prodavnica saIzmenama = new Prodavnica();
            saIzmenama.id = new ObjectId(id);
            saIzmenama.string_id = saIzmenama.id.ToString();
            saIzmenama.ime = ime;            
            saIzmenama.broj_telefona = broj_telefona;
            saIzmenama.adresa = adresa;
            saIzmenama.lozinka = lozinka;
            saIzmenama.proizvodi = prod.proizvodi;
            saIzmenama.email = prod.email;

            if(kat != null)
            {
                saIzmenama.katerogija = kat;
                saIzmenama.string_kategorija=kat.ime;
            }

            var filter = Builders<Prodavnica>.Filter.Eq(p => p.id, objectID);
            var result = await prodavnica.ReplaceOneAsync(filter, saIzmenama);

            return true;
        }

        [HttpGet]
        [Route("SearchProdavnica/{name}")]
        public List<Prodavnica> SearchProdavnica(string name)
        {
            var filter = Builders<Prodavnica>.Filter.Regex("ime", new BsonRegularExpression(name, "i"));
            return prodavnica.Find(filter).ToList();
        }

        [HttpGet]
        [Route("SearchKategorija/{name}")]
        public List<Kategorija> SearchKategorija(string name)
        {
            var filter = Builders<Kategorija>.Filter.Regex("ime", new BsonRegularExpression(name, "i"));
            return kategorije.Find(filter).ToList();
        }

        [HttpGet]
        [Route("SearchProizvod/{name}")]
        public Proizvod[] SearchProizvod(string name)
        {
            var filter = Builders<Proizvod>.Filter.Regex("ime", new BsonRegularExpression(name, "i"));
            return proizvodi.Find(filter).ToList().ToArray();
        }

        [HttpGet]
        [Route("SearchProdavnicaKategorija/{name}")]
        public async Task<List<Prodavnica>> SearchProdavnicaKategorija(string name)
        {
            var kat = await kategorije.Find(pr => pr.ime == name).FirstOrDefaultAsync();
            return prodavnica.Find(pr => pr.katerogija == kat).ToList();
        }

        [HttpGet]
        [Route("SearchProizvodiProdavnica/{name}")]
        public async Task<List<Proizvod>> SearchProizvodiProdavnica(string name)
        {
            var prod = await prodavnica.Find(pr => pr.ime == name).FirstOrDefaultAsync();
            return prod.proizvodi;
        }

        [HttpGet]
        [Route("SearchProizvodKategorija/{name}")]
        public Proizvod[] SearchProizvodKategorija(string name)
        {
            return proizvodi.Find(pr => pr.kategorija == name).ToList().ToArray();
        }

        [HttpPost("DodajSlikuProdavnica/{id}")]
        public async Task<bool> DodajSlikuProdavnica(string id)
        {
            try
            {
                var objectID = new ObjectId(id);

                var formCollection = await Request.ReadFormAsync();
                var file = formCollection.Files.First();
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    fileName.Insert(fileName.Length - 5, objectID.ToString());
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    var filter = Builders<Prodavnica>.Filter.Eq(p => p.id, objectID);
                    var update = Builders<Prodavnica>.Update.Set("slika", dbPath);
                    var result = await prodavnica.UpdateOneAsync(filter, update);
                }
                else
                    return false;

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpPost("DodajSlikuProizvod/{id}")]
        public async Task<bool> DodajSlikuProizvod(string id)
        {
            try
            {
                var objectID = new ObjectId(id);
            
                var formCollection = await Request.ReadFormAsync();
                var file = formCollection.Files.First();
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    var filter = Builders<Proizvod>.Filter.Eq(p => p.id, objectID);
                    var update = Builders<Proizvod>.Update.Set("slika", dbPath);
                    var result = await proizvodi.UpdateOneAsync(filter, update);
                    
                    var proiz = await proizvodi.Find(p=>p.id == objectID).FirstOrDefaultAsync();
                    
                    var filter_P = Builders<Prodavnica>.Filter.Where(x => x.proizvodi.Any(y => y.id == objectID));
                    var update_P = Builders<Prodavnica>.Update.Set("proizvodi.$", proiz);
                    prodavnica.UpdateOne(filter_P, update_P);
                }
                else
                    return false;

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpPut]
        [Route("DodajProizvodUKorpu/{id_proizvoda}/{id_klijenta}")]
        public async Task<bool> DodajProizvodUKorpu(string id_proizvoda, string id_klijenta)
        {
            bool prisutan = false;
            var klijentId = new ObjectId(id_klijenta);
            var klijent = await korisnik.Find(k => k.id == klijentId).FirstOrDefaultAsync();

            if (klijent == null)
                return false;

            var objectID2 = new ObjectId(id_proizvoda);
            var proizvod = await proizvodi.Find(k => k.id == objectID2).FirstOrDefaultAsync();

            if (proizvod == null)
                return false;

            foreach(Proizvod p in klijent.korpa.proizvodi)
            {
                if (p.id == proizvod.id)
                    prisutan = true;
            }
            if (prisutan)
            {
                proizvod.id = ObjectId.GenerateNewId();
                proizvod.id_string = proizvod.id.ToString();
            }

            var objectID3 = klijent.korpa.id;
            var filter = Builders<Korpa>.Filter.Eq(p => p.id, objectID3);
            var update = Builders<Korpa>.Update.Push("proizvodi", proizvod);
            var result = korpa.UpdateOne(filter, update);

            korisnik.UpdateOne(p => p.korpa.id == objectID3, MongoDB.Driver.Builders<Korisnik>.Update.Push("korpa.proizvodi", proizvod));

            return true;
        }

        [HttpGet]
        [Route("vratiProizvodeUKorpi/{id_klijenta}")]
        public async Task<List<Proizvod>> vratiProizvodeUKorpi(string id_klijenta)
        {
            var klijentId = new ObjectId(id_klijenta);
            var klijent = await korisnik.Find(k => k.id == klijentId).FirstOrDefaultAsync();
            if (klijent == null)
               return null;
            return klijent.korpa.proizvodi;
        }

        [HttpDelete]
        [Route("IzbaciProizvodIzKorpe/{id_proizvod_korpa}/{id_klijenta}")]
        public async Task<bool> IzbaciProizvodIzKorpe(string id_proizvod_korpa, string id_klijenta)
        {
            var objectID = new ObjectId(id_klijenta);
            var klijent = await korisnik.Find(k => k.id == objectID).FirstOrDefaultAsync();
            var proizvodId = new ObjectId(id_proizvod_korpa);

            var korpaId = klijent.korpa.id;
            var korpa_ = await korpa.Find(pr => pr.id == korpaId).FirstOrDefaultAsync();

            List<Proizvod> lista = korpa_.proizvodi;
            foreach (Proizvod p in lista)
            {
                if (p.id == proizvodId)
                {
                    var filter = Builders<Korpa>.Filter.Eq(p => p.id, korpaId);
                    var update = Builders<Korpa>.Update.Pull("proizvodi", p);
                    var result = korpa.UpdateOne(filter, update);
                    korisnik.UpdateOne(p => p.korpa.id == korpaId, MongoDB.Driver.Builders<Korisnik>.Update.Pull("korpa.proizvodi", p));
                    return true;
                }
            }
            return false;
        }

        [HttpPost]
        [Route("Poruci/{idKlijenta}")]
        public async Task<bool> Poruci(string idKlijenta)
        {
            var narudzbinaID = ObjectId.GenerateNewId();
            var klijentID = new ObjectId(idKlijenta);
            var klijent = await korisnik.Find(k => k.id == klijentID).FirstOrDefaultAsync();

            if (klijent == null)
                return false;

            Narudzbina n = new Narudzbina();
            n.id = narudzbinaID;
            n.id_string = n.id.ToString();
            n.klijent = klijent;
            float cena = 0;

            List<Proizvod> lista_korpa = klijent.korpa.proizvodi;
            List<Proizvod> listaProizvoda = new List<Proizvod>();

            foreach (Proizvod proizvod_ in lista_korpa)
            {        
                listaProizvoda.Add(proizvod_);
                cena += proizvod_.cena;
            }

            if (cena==0)
            {
                return false;
            }

            n.cena = cena;
            n.vreme = DateTime.Now;
            n.proizvodi = listaProizvoda;
            n.status = Status.dostavljeno;
            klijent.korpa.proizvodi.Clear();

            var filter = Builders<Korpa>.Filter.Eq(p=>p.id,klijent.korpa.id);
            var update = Builders<Korpa>.Update.Set("proizvodi", klijent.korpa.proizvodi);
            await korpa.UpdateOneAsync(filter, update);

            korisnik.UpdateOne(p => p.korpa.id == klijent.korpa.id, MongoDB.Driver.Builders<Korisnik>.Update.PullAll("korpa.proizvodi", klijent.korpa.proizvodi));

            var filter2 = Builders<Korisnik>.Filter.Eq(p => p.id, klijentID);
            var update2 = Builders<Korisnik>.Update.Set("korpa.proizvodi", klijent.korpa.proizvodi);
            await korisnik.UpdateOneAsync(filter2, update2);
            await narudzbine.InsertOneAsync(n);

            return true;
        }

        [HttpGet]
        [Route("vratiProizvode/{idProdavnice}")]
        public async Task<List<Proizvod>> vratiProizvode(string idProdavnice)
        {
            var objectId = new ObjectId(idProdavnice);
            var Prodavnica = await prodavnica.Find(k => k.id == objectId).FirstOrDefaultAsync();
            if (Prodavnica == null)
                return null;

            return Prodavnica.proizvodi;
        }

        [HttpPut]
        [Route("OceniProdavnicu/{idProdavnice}/{ocena}/{idKorisnika}")]
        public async Task<bool> OceniProdavnicu(string idProdavnice,int ocena,string idKorisnika)
        {

            var objectId = new ObjectId(idProdavnice);
            var obj_prodavnica = await prodavnica.Find(k => k.id == objectId).FirstOrDefaultAsync(); 
         
            if (obj_prodavnica == null )
                return false;
            if (obj_prodavnica.ocenjivaci != null && obj_prodavnica.ocenjivaci.Contains(idKorisnika))
                return false;

            
            var zbir_ocena = obj_prodavnica.ocena * obj_prodavnica.broj_ocena;
            obj_prodavnica.broj_ocena = obj_prodavnica.broj_ocena + 1;
            obj_prodavnica.ocena = (zbir_ocena + ocena) / obj_prodavnica.broj_ocena;
            obj_prodavnica.ocena = (float)Decimal.Round((Decimal)obj_prodavnica.ocena, 2);
            obj_prodavnica.ocenjivaci.Add(idKorisnika);
            var filter = Builders<Prodavnica>.Filter.Eq(p => p.id, objectId);
            var result = await prodavnica.ReplaceOneAsync(filter, obj_prodavnica);
           
            return true;
        }

        [HttpGet]
        [Route("VratiKategoriju/{idProdavnice}")]
        public async Task<Kategorija> VratiKategoriju(string idProdavnice)
        {
            var objectId = new ObjectId(idProdavnice);
            var obj_pr = await prodavnica.Find(k => k.id == objectId).FirstOrDefaultAsync();

            if (obj_pr == null)
                return null;

            return obj_pr.katerogija;
        }
    }
}