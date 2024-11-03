using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Any;
using Neo4J.Models;
using Neo4jClient;
using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;
using System;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Neo4J.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KorisnikController : ControllerBase
    {
        private readonly IGraphClient _client;

        private static IWebHostEnvironment _webHostEnvironment;

        public KorisnikController(IGraphClient client, IWebHostEnvironment webHostEnvironment)
        {
            _client = client;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost("register/{ime}/{prezime}/{rodjedan}/{korisnicko_ime}/{lozinka}/{email}/{drzava}")]
        public async Task<bool> register(string ime, string prezime,string rodjedan, string korisnicko_ime,string lozinka,string email, string drzava)
        { 
            if ((await _client.Cypher.Match("(u:Korisnik{ email:'" + email + "'})").Return(u => u.As<Korisnik>()).ResultsAsync).FirstOrDefault()!= null)              
                return false;
        
           if ((await _client.Cypher.Match("(u:Korisnik{ korisnicko_ime:'" + korisnicko_ime + "'})").Return(u => u.As<Korisnik>()).ResultsAsync).FirstOrDefault() != null)
               return false;

            drzava = drzava.ToLower();


            Korisnik novi = new Korisnik();
            novi.ime = ime;
            novi.prezime = prezime;
            novi.korisnicko_ime = korisnicko_ime;
            novi.email = email;
            novi.lozinka = lozinka;
            novi.rodjedan = rodjedan;
            novi.online = false;
            novi.profilnaSlika = "";
            novi.tip = TipKorsnika.korisnik;
            _client.Cypher.Create("(u:Korisnik {ime:$ime, prezime:$prezime ,email:$email,profilnaSlika:$profilnaSlika,korisnicko_ime: $korisnicko_ime , lozinka: $lozinka, rodjedan:$rodjedan ,online:$online ,tip:$tip})").WithParams(novi).ExecuteWithoutResultsAsync().Wait();

            var dr = await _client.Cypher.Match("(u:Drzava" + "{naziv:\'" + drzava + "\'}" + ")").Return(u => u.As<Drzava>()).ResultsAsync;
            Drzava drz = dr.FirstOrDefault();

            if (drz == null)
                _client.Cypher.Create("(p:Drzava {naziv:\'" + drzava + "\'})").ExecuteWithoutResultsAsync().Wait();

            //CREATE (node1)-[:RelationshipType]->(node2) 

            await _client.Cypher.Match("(u:Korisnik {korisnicko_ime:\'" + novi.korisnicko_ime + "\'})")
                          .Match("(d:Drzava {naziv:\'" + drzava + "\'})")
                          .Create("(u)-[:Zivi]->(d)").ExecuteWithoutResultsAsync();

             _client.Cypher.Create("(p:Preference {korisnicko_ime:\'" + novi.korisnicko_ime + "\'})").ExecuteWithoutResultsAsync().Wait();

            await _client.Cypher.Match("(u:Korisnik {korisnicko_ime:\'" + novi.korisnicko_ime + "\'})")
                          .Match("(p:Preference {korisnicko_ime:\'" + novi.korisnicko_ime + "\'})")
                          .Create("(u)-[:preferira]->(p)").ExecuteWithoutResultsAsync();

            return true;
        }


        [HttpPut("login/{korisnicko_ime}/{lozinka}")]
        public async Task<bool> login(string korisnicko_ime, string lozinka)
        {
            string searchString = "";

            if (!string.IsNullOrEmpty(korisnicko_ime))
                searchString = "{korisnicko_ime:\'" + korisnicko_ime + "\'}";      
            

            var result = await _client.Cypher.Match("(u:Korisnik"+searchString +")").Return(u => u.As<Korisnik>()).ResultsAsync;
           
            Korisnik korisnik = result.FirstOrDefault();

            if (korisnik.lozinka != lozinka)
                return false;

            await _client.Cypher.Match("(u:Korisnik" + searchString + ")").Set("u.online = true").ExecuteWithoutResultsAsync();


            return true;
           
        }

        [HttpPut("logout/{korisnicko_ime}")]
        public async Task<bool> logout(string korisnicko_ime)
        {
            string searchString = "";

            if (!string.IsNullOrEmpty(korisnicko_ime))
                searchString = "{korisnicko_ime:\'" + korisnicko_ime + "\'}";


            var result = await _client.Cypher.Match("(u:Korisnik" + searchString + ")").Return(u => u.As<Korisnik>()).ResultsAsync;

            Korisnik korisnik = result.FirstOrDefault();
  
            if (korisnik == null)
                return false;

            await _client.Cypher.Match("(u:Korisnik" + searchString + ")").Set("u.online = false").ExecuteWithoutResultsAsync();

                return true;
        }

        [HttpGet("GetProfilnaSlika/{korisnicko_ime}")]
        public async Task<Korisnik> profilna(string korisnicko_ime)
        {
            string searchString = "";

            if (!string.IsNullOrEmpty(korisnicko_ime))
                searchString = "{korisnicko_ime:\'" + korisnicko_ime + "\'}";


            var result = await _client.Cypher.Match("(u:Korisnik" + searchString + ")").Return(u => u.As<Korisnik>()).ResultsAsync;

            Korisnik korisnik = result.FirstOrDefault();

            var Slika = korisnik.profilnaSlika;
            korisnik = new Korisnik();
            korisnik.profilnaSlika = Slika;


            return korisnik;
        }

        [HttpPost("UploadPicture/{korisnicko_ime}/{drzava}/{tagovi}")]
        public async Task<bool> Upload_picture(string korisnicko_ime, string drzava, string tagovi)
        {
            drzava = drzava.ToLower();
            try
            {
                Korisnik korisnik = (await _client.Cypher.Match("(u:Korisnik{ korisnicko_ime:'" + korisnicko_ime + "'})").Return(u => u.As<Korisnik>()).ResultsAsync).FirstOrDefault();
                Drzava dr = (await _client.Cypher.Match("(u:Drzava{ naziv:'" + drzava + "'})").Return(u => u.As<Drzava>()).ResultsAsync).FirstOrDefault();
                List<string> itemsList = tagovi.Split(',').ToList();

                List<Tag> lista_tagova = new List<Tag>();

                foreach (string item in itemsList)
                {
                    Tag tag = new Tag();
                    tag.naziv = item;
                    lista_tagova.Add(tag);
                }

                Slika slika = new Slika();
                slika.broj_lajkova = 0;
                slika.broj_komentara = 0;
                slika.datum_objave = DateTime.Now;


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
                   slika.lokacija = dbPath;
                }
                else
                    return false;

                _client.Cypher.Merge("(u:Slika {lokacija:$lokacija, broj_lajkova:$broj_lajkova ,broj_komentara:$broj_komentara, datum_objave:$datum_objave})").WithParams(slika).ExecuteWithoutResultsAsync().Wait();

                await _client.Cypher.Match("(u:Korisnik {korisnicko_ime:\'" + korisnicko_ime + "\'})")
                          .Match("(d:Slika {lokacija:\'" + slika.lokacija + "\'})")
                          .Merge("(u)-[:Posted]->(d)").ExecuteWithoutResultsAsync();

                foreach (var tag1 in lista_tagova)
                {
                    var pom = await _client.Cypher.Match("(u:Tag" + "{naziv:\'" + tag1.naziv + "\'}" + ")").Return(u => u.As<Tag>()).ResultsAsync;
                    Tag ta = pom.FirstOrDefault();

                    if (ta == null)
                        _client.Cypher.Create("(p:Tag {naziv:\'" + tag1.naziv + "\'})").ExecuteWithoutResultsAsync().Wait();

                    await _client.Cypher.Match("(u:Slika {lokacija:\'" + slika.lokacija + "\'})")
                                  .Match("(m:Tag {naziv:\'" + tag1.naziv + "\'})")
                                  .Merge("(u)-[:Has_tag]->(m)").ExecuteWithoutResultsAsync();
                }

                if (dr == null)
                    _client.Cypher.Create("(p:Drzava {naziv:\'" + drzava + "\'})").ExecuteWithoutResultsAsync().Wait();

                await _client.Cypher.Match("(u:Slika {lokacija:\'" + slika.lokacija + "\'})")
                                 .Match("(m:Drzava {naziv:\'" + drzava + "\'})")
                                 .Merge("(u)-[:Posted_In]->(m)").ExecuteWithoutResultsAsync();            
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpPost("UploadProfilePicture/{korisnicko_ime}")]
        public async Task<bool> UploadProfilePicture(string korisnicko_ime)
        {
            try
            {
                Korisnik korisnik = (await _client.Cypher.Match("(u:Korisnik{ korisnicko_ime:'" + korisnicko_ime + "'})").Return(u => u.As<Korisnik>()).ResultsAsync).FirstOrDefault();

                var formCollection = await Request.ReadFormAsync();
                var file = formCollection.Files.First();
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var searchString = "{korisnicko_ime:\'" + korisnicko_ime + "\'}";
                if (file.Length > 0)
                {
                   var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                   var fullPath = Path.Combine(pathToSave, fileName);
                   var dbPath = Path.Combine(folderName, fileName);
                   using (var stream = new FileStream(fullPath, FileMode.Create))
                   {
                       file.CopyTo(stream);
                   }
                   korisnik.profilnaSlika = dbPath;
                   _client.Cypher.Match($"(u:Korisnik{searchString})").Set($"u.profilnaSlika='{dbPath}'").ExecuteWithoutResultsAsync().Wait();
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

        [HttpDelete("obrisiSliku/{lokacija}/{korisnicko_ime}")]
        public async Task<bool> obrisiSliku(string lokacija,string korisnicko_ime)
        {
            string searchString2 = "";

            string s2=lokacija.Replace("$@$", "\\");
            if (string.IsNullOrEmpty(s2))
                return false;
            searchString2 = "{lokacija:'" + s2 + "'}";

            var result2 = await _client.Cypher.Match("(s:Slika{lokacija:'" + s2 + "'})").Return(s => s.As<Slika>()).ResultsAsync;
            Slika slika = result2.FirstOrDefault();

            if (slika == null)
                return false;

            await _client.Cypher.Match($"(u:Slika{{lokacija: '{s2}'}})-[r:Has_tag]->(t:Tag)")
                                .Match($"(u:Slika{{lokacija: '{s2}'}})-[r2:Posted_In]->(d:Drzava)")
                                .Match($"(k:Korisnik{{korisnicko_ime: '{korisnicko_ime}'}})-[r3:Posted]->(u:Slika{{lokacija: '{s2}'}})")
                                .Delete("r,r2,r3,u")
                                .ExecuteWithoutResultsAsync();

            await _client.Cypher.Match($"(k:Korisnik)-[r4:Liked]->(u:Slika{{lokacija: '{s2}'}})")
                                .Match($"(k:Korisnik)-[r5:Commented]->(u:Slika{{lokacija: '{s2}'}})")
                                .Delete("r4,r5,u")
                                .ExecuteWithoutResultsAsync();
                                
            await _client.Cypher.Match($"(k:Mention)-[r6:naSlici]->(u:Slika{{lokacija: '{s2}'}})")
                                .Match($"(u:Slika{{lokacija: '{s2}'}})-[r7:Veza]->(m:Drzava)")
                                .Match($"(u:Slika{{lokacija: '{s2}'}})-[r8:slika_tag]->(m:Tag)")
                                .Match($"(u:Slika{{lokacija: '{s2}'}})-[r9:slika_korisnik]->(m:Korisnik)")
                                .Delete("r6,r7,r8,r9,u")
                                .ExecuteWithoutResultsAsync();

            return true;
        }

        [HttpGet("PreuzmiSlike/{korisnicko_ime}")]
        public async Task<List<Slika>> PreuzmiSlike(string korisnicko_ime)
        {

            var result3 = await _client.Cypher.Match($"(k:Korisnik{{korisnicko_ime: '{korisnicko_ime}'}})-[r3:Posted]->(m:Slika)").Return(m => m.As<Slika>()).ResultsAsync;

            List<Slika> sl = new List<Slika>();
            foreach (var item in result3)
            {
                sl.Add(item);
            }

            return sl;
        }



        [HttpGet("PreuzmiKorisnika/{korisnicko_ime}")]
        public async Task<Korisnik> PreuzmiKorisnika(string korisnicko_ime)
        {

            string searchString = "";

            if (!string.IsNullOrEmpty(korisnicko_ime))
                searchString = "{korisnicko_ime:\'" + korisnicko_ime + "\'}";

            var result = await _client.Cypher.Match("(u:Korisnik" + searchString + ")").Return(u => u.As<Korisnik>()).ResultsAsync;

            Korisnik korisnik = result.FirstOrDefault();

            return korisnik;
        }

        [HttpGet("PreuzmiTagove/{korisnicko_ime}")]
        public async Task<List<Tag>> PreuzmiTagove(string korisnicko_ime)
        {

           
            var result3 = await _client.Cypher.Match($"(k:Preference{{korisnicko_ime: '{korisnicko_ime}'}})-[r:Has_tag]->(m:Tag)").Return(m => m.As<Tag>()).ResultsAsync;

            List<Tag> t = new List<Tag>();
            foreach (var item in result3)
            {
                t.Add(item);
            }

            return t;
        }

        [HttpGet("PreuzmiTagoveSlika/{lokacija}")]
        public async Task<List<Tag>> PreuzmiTagoveSlika(string lokacija)
        {

            string s2=lokacija.Replace("$@$", "\\");
            var result3 = await _client.Cypher.Match($"(k:Slika{{lokacija: '{s2}'}})-[r:Has_tag]->(m:Tag)").Return(m => m.As<Tag>()).ResultsAsync;

            List<Tag> t = new List<Tag>();
            foreach (var item in result3)
            {
                t.Add(item);
            }

            return t;
        }

        [HttpGet("PreuzmiDrzavu/{korisnicko_ime}")]
        public async Task<List<Drzava>> PreuzmiDrzavu(string korisnicko_ime)
        {

            var result = await _client.Cypher.Match($"(u:Korisnik{{korisnicko_ime: '{korisnicko_ime}'}})-[r2:Zivi]->(d:Drzava)").Return(d => d.As<Drzava>()).ResultsAsync;
            var result2 = await _client.Cypher.Match($"(u2:Preference{{korisnicko_ime: '{korisnicko_ime}'}})-[r3:Prefers_Country]->(d2:Drzava)").Return(d2 => d2.As<Drzava>()).ResultsAsync;

            Drzava d1 = result.FirstOrDefault();
            Drzava d2 = result2.FirstOrDefault();

            List<Drzava> d = new List<Drzava>();

            if (d1 != null)
                d.Add(d1);
            if(d2 != null)
                d.Add(d2);

            return d;
        }

        [HttpPut("changeUserInfo/{korisnicko_ime}/{novo_ime}/{novo_prezime}/{novi_rodj}/{novi_email}")]
        public async Task<bool> changeUserInfo(string korisnicko_ime, string novo_ime,string novo_prezime, string novi_rodj, string novi_email)
        {
            string searchString = "";

            if (!string.IsNullOrEmpty(korisnicko_ime))
                searchString = "{korisnicko_ime:\'" + korisnicko_ime + "\'}";

            var result = await _client.Cypher.Match("(u:Korisnik" + searchString + ")").Return(u => u.As<Korisnik>()).ResultsAsync;

            Korisnik korisnik = result.FirstOrDefault();

            if (korisnik == null)
                return false;

            await _client.Cypher.Match($"(u:Korisnik{searchString})")
                                                                    .Set($"u.ime='{novo_ime}'")
                                                                    .Set($"u.prezime='{novo_prezime}'")
                                                                    .Set($"u.rodjedan='{novi_rodj}'")
                                                                    .Set($"u.email='{novi_email}'").ExecuteWithoutResultsAsync();

            return true;
        }

        [HttpPut("changePreferences/{korisnicko_ime}/{tagovi}/{drzava}")]
        public async Task<bool> changePreferences(string korisnicko_ime,string tagovi, string drzava)
        {
            drzava = drzava.ToLower();
            string searchString = "";
            drzava = drzava.ToLower();

            if (!string.IsNullOrEmpty(korisnicko_ime))
                searchString = "{korisnicko_ime:\'" + korisnicko_ime + "\'}";

            await _client.Cypher.Match($"(u:Preference{{korisnicko_ime: '{korisnicko_ime}'}})-[r:Has_tag]->(t:Tag)")
                                .Match($"(u:Preference{{korisnicko_ime: '{korisnicko_ime}'}})-[r2:Prefers_Country]->(d:Drzava)")
                                .Delete("r,r2")
                                .ExecuteWithoutResultsAsync();


            List<string> itemsList = tagovi.Split(',').ToList();

            var result = await _client.Cypher.Match("(u:Preference" + searchString + ")").Return(u => u.As<Preference>()).ResultsAsync;

            Preference preference = result.FirstOrDefault();

            if (preference == null)
                return false;

            List<Tag> lista_tagova = new List<Tag>();

            foreach (string item in itemsList)
            {
                Tag tag = new Tag();
                tag.naziv = item;
                lista_tagova.Add(tag);
            }

            foreach (var tag1 in lista_tagova)
            {
                var pom = await _client.Cypher.Match("(u:Tag" + "{naziv:\'" + tag1.naziv + "\'}" + ")").Return(u => u.As<Tag>()).ResultsAsync;
                Tag ta = pom.FirstOrDefault();

                if (ta == null)
                    _client.Cypher.Create("(p:Tag {naziv:\'" + tag1.naziv + "\'})").ExecuteWithoutResultsAsync().Wait();

                await _client.Cypher.Match("(u:Preference {korisnicko_ime:\'" + korisnicko_ime + "\'})")
                              .Match("(m:Tag {naziv:\'" + tag1.naziv + "\'})")
                              .Create("(u)-[:Has_tag]->(m)").ExecuteWithoutResultsAsync();
            }


            Drzava d = new Drzava(); d.naziv = drzava;
            var dr = await _client.Cypher.Match("(u:Drzava" + "{naziv:\'" + d.naziv + "\'}" + ")").Return(u => u.As<Drzava>()).ResultsAsync;
            Drzava drz = dr.FirstOrDefault();

            if (drz == null)
                _client.Cypher.Create("(p:Drzava {naziv:\'" + d.naziv + "\'})").ExecuteWithoutResultsAsync().Wait();

            await _client.Cypher.Match("(u:Preference {korisnicko_ime:\'" + korisnicko_ime + "\'})")
                             .Match("(m:Drzava {naziv:\'" + d.naziv + "\'})")
                             .Create("(u)-[:Prefers_Country]->(m)").ExecuteWithoutResultsAsync();


            await _client.Cypher.Match($"(u:Preference{searchString})")
                                                                    .Set($"u.tagovi='{tagovi}'").ExecuteWithoutResultsAsync();
            return true;
        }

[HttpPut("changePreferences2/{korisnicko_ime}/{tagovi}/{drzava}/{region}")]
        public async Task<bool> changePreferences2(string korisnicko_ime,string tagovi, string drzava,string region)
        {
            drzava = drzava.ToLower();
            string searchString = "";

            if (!string.IsNullOrEmpty(korisnicko_ime))
                searchString = "{korisnicko_ime:\'" + korisnicko_ime + "\'}";

            await _client.Cypher.Match($"(u:Preference{{korisnicko_ime: '{korisnicko_ime}'}})-[r:Has_tag]->(t:Tag)")
                                .Match($"(u:Preference{{korisnicko_ime: '{korisnicko_ime}'}})-[r2:Prefers_Country]->(d:Drzava)")
                                .Delete("r,r2")
                                .ExecuteWithoutResultsAsync();


            List<string> itemsList = tagovi.Split(',').ToList();

            var result = await _client.Cypher.Match("(u:Preference" + searchString + ")").Return(u => u.As<Preference>()).ResultsAsync;

            Preference preference = result.FirstOrDefault();

            if (preference == null)
                return false;

            List<Tag> lista_tagova = new List<Tag>();

            foreach (string item in itemsList)
            {
                Tag tag = new Tag();
                tag.naziv = item;
                lista_tagova.Add(tag);
            }

            foreach (var tag1 in lista_tagova)
            {
                var pom = await _client.Cypher.Match("(u:Tag" + "{naziv:\'" + tag1.naziv + "\'}" + ")").Return(u => u.As<Tag>()).ResultsAsync;
                Tag ta = pom.FirstOrDefault();

                if (ta == null)
                    _client.Cypher.Create("(p:Tag {naziv:\'" + tag1.naziv + "\'})").ExecuteWithoutResultsAsync().Wait();

                await _client.Cypher.Match("(u:Preference {korisnicko_ime:\'" + korisnicko_ime + "\'})")
                              .Match("(m:Tag {naziv:\'" + tag1.naziv + "\'})")
                              .Create("(u)-[:Has_tag]->(m)").ExecuteWithoutResultsAsync();
            }


            Drzava d = new Drzava(); d.naziv = drzava;
            var dr = await _client.Cypher.Match("(u:Drzava" + "{naziv:\'" + d.naziv + "\'}" + ")").Return(u => u.As<Drzava>()).ResultsAsync;
            Drzava drz = dr.FirstOrDefault();

            if (drz == null)
                _client.Cypher.Create("(p:Drzava {naziv:\'" + d.naziv + "\'})").ExecuteWithoutResultsAsync().Wait();

            await _client.Cypher.Match("(u:Preference {korisnicko_ime:\'" + korisnicko_ime + "\'})")
                             .Match("(m:Drzava {naziv:\'" + d.naziv + "\'})")
                             .Create("(u)-[:Prefers_Country]->(m)").ExecuteWithoutResultsAsync();
            Region r = new Region(); r.naziv = region;
            var reg = await _client.Cypher.Match("(u:Region" + "{naziv:\'" + r.naziv + "\'}" + ")").Return(u => u.As<Region>()).ResultsAsync;
            Region re = reg.FirstOrDefault();

            if (re == null){
                _client.Cypher.Create("(p:Region {naziv:\'" + r.naziv + "\'})").ExecuteWithoutResultsAsync().Wait();
                await _client.Cypher.Match("(u:Drzava {naziv:\'" + d.naziv + "\'})")
                             .Match("(q:Region {naziv:\'" + r.naziv + "\'})")
                             .Create("(u)-[:region_drzava]->(q)").ExecuteWithoutResultsAsync();
            }
            await _client.Cypher.Match("(u:Preference {korisnicko_ime:\'" + korisnicko_ime + "\'})")
                             .Match("(m:Region {naziv:\'" + r.naziv + "\'})")
                             .Create("(u)-[:Prefers_Region]->(m)").ExecuteWithoutResultsAsync();

            await _client.Cypher.Match($"(u:Preference{searchString})")
                                                                    .Set($"u.tagovi='{tagovi}'").ExecuteWithoutResultsAsync();
            return true;
        }

        [HttpPut("changePicInfo/{lokacija}/{tagovi}")]
        public async Task<bool> changePicInfo(string lokacija, string tagovi)
        {
            string searchString = "";
            string s2=lokacija.Replace("$@$", "\\");
            if (!string.IsNullOrEmpty(s2))
                searchString = "{lokacija:\'" + s2 + "\'}";

            await _client.Cypher
                             .Match($"(u:Slika{{lokacija: '{s2}'}})-[r:Has_tag]->(t:Tag)")
                             .Delete("r")
                             .ExecuteWithoutResultsAsync();


            List<string> itemsList = tagovi.Split(',').ToList();

            var result = await _client.Cypher.Match("(u:Slika" + searchString + ")").Return(u => u.As<Slika>()).ResultsAsync;

            Slika slika = result.FirstOrDefault();

            if (slika == null)
                return false;

            List<Tag> lista_tagova = new List<Tag>();

            foreach (string item in itemsList)
            {
                Tag tag = new Tag();
                tag.naziv = item;
                lista_tagova.Add(tag);
            }

            foreach (var tag1 in lista_tagova)
            {
                var pom = await _client.Cypher.Match("(u:Tag" + "{naziv:\'" + tag1.naziv + "\'}" + ")").Return(u => u.As<Tag>()).ResultsAsync;
                Tag ta = pom.FirstOrDefault();
                if (ta == null)
                    _client.Cypher.Create("(p:Tag {naziv:\'" + tag1.naziv + "\'})").ExecuteWithoutResultsAsync().Wait();
                await _client.Cypher.Match("(u:Slika {lokacija:\'" + s2 + "\'})")
                              .Match("(m:Tag {naziv:\'" + tag1.naziv + "\'})")
                              .Create("(u)-[:Has_tag]->(m)").ExecuteWithoutResultsAsync();
            }

            await _client.Cypher.Match($"(u:Slika{searchString})")
                                                                    .Set($"u.tag='{tagovi}'").ExecuteWithoutResultsAsync();

            return true;
        }

        [HttpPut("Follow/{korisnicko_ime}/{korisnikKogPratimo}")]
        public async Task<bool> Follow(string korisnicko_ime, string korisnikKogPratimo)
        {
            string searchString = "";
            string searchString2 = "";

            if (string.IsNullOrEmpty(korisnicko_ime))
                 return false;
                searchString = "{korisnicko_ime:'" + korisnicko_ime + "'}";

            if (string.IsNullOrEmpty(korisnikKogPratimo))
                 return false;
                searchString2 = "{korisnicko_ime:'" + korisnikKogPratimo + "'}";
            if (korisnicko_ime.Equals(korisnikKogPratimo))
                return false;

            var result = await _client.Cypher.Match("(u:Korisnik" + searchString + ")").Return(u => u.As<Korisnik>()).ResultsAsync;
            var result2 = await _client.Cypher.Match("(u:Korisnik" + searchString2 + ")").Return(u => u.As<Korisnik>()).ResultsAsync;

            Korisnik korisnik = result.FirstOrDefault();
            Korisnik korisnik2 = result2.FirstOrDefault();

            if (korisnik == null || korisnik2 == null)
                return false;
            await _client.Cypher.Match("(u:Korisnik {korisnicko_ime:\'" + korisnik.korisnicko_ime + "\'})")
                         .Match("(n:Korisnik {korisnicko_ime:\'" + korisnik2.korisnicko_ime + "\'})")
                         .Merge("(u)-[:Follow]->(n)").ExecuteWithoutResultsAsync();
            return true;
        }
        [HttpDelete("Unfollow/{korisnicko_ime}/{korisnikKogPratimo}")]
        public async Task<bool> Unfollow(string korisnicko_ime, string korisnikKogPratimo)
        {
            string searchString = "";
            string searchString2 = "";

            if (string.IsNullOrEmpty(korisnicko_ime))
                return false;
            searchString = "{korisnicko_ime:'" + korisnicko_ime + "'}";

            if (string.IsNullOrEmpty(korisnikKogPratimo))
                return false;
            searchString2 = "{korisnicko_ime:'" + korisnikKogPratimo + "'}";
            if (korisnicko_ime.Equals(korisnikKogPratimo))
                return false;

            var result = await _client.Cypher.Match("(u:Korisnik" + searchString + ")").Return(u => u.As<Korisnik>()).ResultsAsync;
            var result2 = await _client.Cypher.Match("(u:Korisnik" + searchString2 + ")").Return(u => u.As<Korisnik>()).ResultsAsync;

            Korisnik korisnik = result.FirstOrDefault();
            Korisnik korisnik2 = result2.FirstOrDefault();

            if (korisnik == null || korisnik2 == null)
                return false;
            //dodaj remove
            var z = _client.Cypher.Match("(u:Korisnik {korisnicko_ime:\'" + korisnik.korisnicko_ime + "\'})-[r:Follow]->(n:Korisnik {korisnicko_ime:\'" + korisnik2.korisnicko_ime + "\'})")
                                  .Delete("r")
                                  .ExecuteWithoutResultsAsync();

            return true;
        }
        [HttpPost("Mention/{lokacija}/{korisnicko_ime}/{korisnikKogPominjemo}")]
        public async Task<bool> Mention(string lokacija,string korisnicko_ime, string korisnikKogPominjemo)
        {
            string searchString = "";
            string searchString2 = "";
            string searchString3 = "";
            string s2=lokacija.Replace("$@$", "\\");
            if (string.IsNullOrEmpty(korisnicko_ime))
                return false;                
            searchString = "{korisnicko_ime:'" + korisnicko_ime + "'}";

            if (string.IsNullOrEmpty(korisnikKogPominjemo))
                return false;               
            searchString2 = "{korisnicko_ime:'" + korisnikKogPominjemo + "'}";

            if (string.IsNullOrEmpty(s2))
                return false;
            searchString3 = "{lokacija:'" + s2 + "'}";

            var result = await _client.Cypher.Match("(u:Korisnik" + searchString + ")").Return(u => u.As<Korisnik>()).ResultsAsync;
            var result2 = await _client.Cypher.Match("(u:Korisnik" + searchString2 + ")").Return(u => u.As<Korisnik>()).ResultsAsync;
            var result3 = await _client.Cypher.Match("(s:Slika" + searchString3 + ")").Return(s => s.As<Slika>()).ResultsAsync;

            Korisnik korisnik = result.FirstOrDefault();
            Korisnik korisnik2 = result2.FirstOrDefault();
            Slika slika = result3.FirstOrDefault();

            if (korisnik == null || korisnik2 == null || slika==null)
                return false;
            _client.Cypher.Create("(p:Mention {slika:\'" + lokacija + "\',salje:\'" + korisnik.korisnicko_ime + "\',prima:\'" + korisnik2.korisnicko_ime + "\'})").ExecuteWithoutResultsAsync().Wait();
            await _client.Cypher.Match("(u:Korisnik {korisnicko_ime:\'" + korisnik.korisnicko_ime + "\'})")
                          .Match("(m:Mention {salje:\'" + korisnik.korisnicko_ime + "\'})")
                          .Create("(u)-[:Pominje]->(m)").ExecuteWithoutResultsAsync();
            await _client.Cypher.Match("(m:Mention {prima:\'" + korisnik2.korisnicko_ime + "\'})")
                                .Match("(u:Korisnik {korisnicko_ime:\'" + korisnik2.korisnicko_ime + "\'})")                          
                                .Create("(m)-[:Pomenut]->(u)").ExecuteWithoutResultsAsync();
            await _client.Cypher.Match("(m:Mention {slika:\'" + slika.lokacija + "\'})")
                                .Match("(s:Slika {lokacija:\'" + slika.lokacija + "\'})")
                                .Create("(m)-[:naSlici]->(s)").ExecuteWithoutResultsAsync();
            return true;
        }

        [HttpPut("Like/{korisnicko_ime}/{lokacija}")]
        public async Task<Slika> Like(string korisnicko_ime, string lokacija)
        {
            string searchString = "";
            string searchString2 = "";
            string s2=lokacija.Replace("$@$", "\\");
            if (string.IsNullOrEmpty(korisnicko_ime))
                // return false;
            searchString = "{korisnicko_ime:'" + korisnicko_ime + "'}";

            if (string.IsNullOrEmpty(s2))
                // return false;
            searchString2 = "{lokacija:'" + s2 + "'}";

            var result = await _client.Cypher.Match("(u:Korisnik{korisnicko_ime:'" + korisnicko_ime + "'})").Return(u => u.As<Korisnik>()).ResultsAsync;
            var result2 = await _client.Cypher.Match("(s:Slika{lokacija:'" + s2 + "'})").Return(s => s.As<Slika>()).ResultsAsync;

            Korisnik korisnik = result.FirstOrDefault();
            Slika slika = result2.FirstOrDefault();
            if (korisnik == null || slika == null)
                return slika;
            await _client.Cypher.Match("(u:Korisnik {korisnicko_ime:\'" + korisnik.korisnicko_ime + "\'})")
                         .Match("(s:Slika {lokacija:\'" + slika.lokacija + "\'})")
                         .Merge("(u)-[:Liked]->(s)").OnCreate().Set("s.broj_lajkova=" + (slika.broj_lajkova+1)).ExecuteWithoutResultsAsync();


            // return true;
            return slika;

        }

        [HttpDelete("Unlike/{korisnicko_ime}/{lokacija}")]
        public async Task<bool> Unlike(string korisnicko_ime, string lokacija)
        {
            string searchString = "";
            string searchString2 = "";
            string s2=lokacija.Replace("$@$", "\\");
            if (string.IsNullOrEmpty(korisnicko_ime))
                return false;
            searchString = "{korisnicko_ime:'" + korisnicko_ime + "'}";

            if (string.IsNullOrEmpty(s2))
                return false;
            searchString2 = "{lokacija:'" + s2 + "'}";

            var result = await _client.Cypher.Match("(u:Korisnik" + searchString + ")").Return(u => u.As<Korisnik>()).ResultsAsync;
            var result2 = await _client.Cypher.Match("(s:Slika" + searchString2 + ")").Return(s => s.As<Slika>()).ResultsAsync;

            Korisnik korisnik = result.FirstOrDefault();
            Slika slika = result2.FirstOrDefault();

            if (korisnik == null || slika == null)
                return false;

            var zahtev = _client.Cypher.Match("(u:Korisnik {korisnicko_ime:\'" + korisnik.korisnicko_ime + "\'})-[r:Liked]->(s:Slika {lokacija:\'" + slika.lokacija + "\'})");
            var veza = await zahtev.Return((u,r,s) => r.As<Like>()).ResultsAsync;
            Console.WriteLine(veza.FirstOrDefault());
            if (veza.FirstOrDefault() == default)
                return false;
            await zahtev.Delete("r").ExecuteWithoutResultsAsync();
            slika.broj_lajkova-=1;
            await _client.Cypher.Match("(s:Slika" + searchString2 + ")").Set("s.broj_lajkova=" + slika.broj_lajkova).ExecuteWithoutResultsAsync();
            return true;
        }

        [HttpPut("DodajKomentar/{korisnicko_ime}/{lokacija}/{tekst}")]
        public async Task<bool> DodajKomentar(string korisnicko_ime,string lokacija,string tekst)
        {
            Guid newId = Generate();
            Console.WriteLine(newId);

            string searchString = "";
            string searchString2 = "";
            string s=lokacija.Replace("$@$", "\\");
            if (string.IsNullOrEmpty(korisnicko_ime))
                return false;
            searchString = "{korisnicko_ime:'" + korisnicko_ime + "'}";

            if (string.IsNullOrEmpty(s))
                return false;
            searchString2 = "{lokacija:'" + s + "'}";

            var result = await _client.Cypher.Match("(u:Korisnik" + searchString + ")").Return(u => u.As<Korisnik>()).ResultsAsync;
            var result2 = await _client.Cypher.Match("(s:Slika" + searchString2 + ")").Return(s => s.As<Slika>()).ResultsAsync;

            Korisnik korisnik = result.FirstOrDefault();
            Slika slika = result2.FirstOrDefault();

            if (korisnik == null || slika == null)
                return false;

            await _client.Cypher.Match("(u:Korisnik {korisnicko_ime:\'" + korisnik.korisnicko_ime + "\'})")
                        .Match("(s:Slika {lokacija:\'" + slika.lokacija + "\'})")
                        .Merge("(u)-[r:Commented{kljuc:\'" + newId + "\',tekst:'" + tekst + "'}]->(s)").OnCreate().Set("s.broj_komentara=" + (slika.broj_komentara + 1)).ExecuteWithoutResultsAsync();

            return true;
        }


        [HttpDelete("ObrisiKomentar/{korisnicko_ime}/{lokacija}/{idk}")]
        public async Task<bool> ObrisiKomentar(string korisnicko_ime, string lokacija, string idk)
        {
            string searchString = "";
            string searchString2 = "";
            string s=lokacija.Replace("$@$", "\\");
            if (string.IsNullOrEmpty(korisnicko_ime))
                return false;
            searchString = "{korisnicko_ime:'" + korisnicko_ime + "'}";

            if (string.IsNullOrEmpty(s))
                return false;
            searchString2 = "{lokacija:'" + s + "'}";

            var result = await _client.Cypher.Match("(u:Korisnik" + searchString + ")").Return(u => u.As<Korisnik>()).ResultsAsync;
            var result2 = await _client.Cypher.Match("(s:Slika" + searchString2 + ")").Return(s => s.As<Slika>()).ResultsAsync;

            Korisnik korisnik = result.FirstOrDefault();
            Slika slika = result2.FirstOrDefault();

            if (korisnik == null || slika == null)
                return false;

            var zahtev = _client.Cypher.Match("(u:Korisnik {korisnicko_ime:\'" + korisnik.korisnicko_ime + "\'})-[r:Commented{kljuc:\'" + idk + "\'}]->(s:Slika {lokacija:\'" + slika.lokacija + "\'})");
            var veza = await zahtev.Return((u, r, s) => r.As<Komentar>()).ResultsAsync;
            await zahtev.Delete("r").ExecuteWithoutResultsAsync();
            slika.broj_komentara-=1;
            await _client.Cypher.Match("(s:Slika" + searchString2 + ")").Set("s.broj_komentara=" + slika.broj_komentara).ExecuteWithoutResultsAsync();

            return true;
        }

        [HttpGet("VratiKorisnikePoPaternu/{patern}")]
        public async Task<List<Korisnik>> vratiKorisnikePoPaternu(string patern)
        {
            if (string.IsNullOrEmpty(patern))
                return null;
            List<Korisnik> listaKorisnika = new List<Korisnik>();
            var korisnici = await _client.Cypher.Match("(u:Korisnik)").Where("u.korisnicko_ime=~'.*" + patern + ".*'").Return<Korisnik>("u").ResultsAsync;
            foreach(Korisnik korisnik in korisnici)
            {
                Korisnik k1 = new Korisnik();
                k1.korisnicko_ime = korisnik.korisnicko_ime;
                k1.ime = korisnik.ime;
                k1.prezime = korisnik.prezime;
                k1.email = korisnik.email;
                k1.rodjedan = korisnik.rodjedan;
                listaKorisnika.Add(k1);
            }
            return listaKorisnika;
        }
        [HttpGet("VratiSlike/{korisnicko_ime}")]
        public async Task<List<Slika>> VratiSlike(string korisnicko_ime)
        {
            if (string.IsNullOrEmpty(korisnicko_ime))
                return null;
            List<Slika> listaSlika = new List<Slika>();
            //Slike iz drzave korisnika
            Drzava d = (await _client.Cypher.Match("(k:Preference{ korisnicko_ime:'" + korisnicko_ime + "'})-[r:Prefers_Country]->(d:Drzava)").Return(d => d.As<Drzava>()).ResultsAsync).FirstOrDefault();
           // string zemlja_korisnika = d.naziv;
            var slike_drzava = await _client.Cypher.Match("(s:Slika)-[r:Posted_In]->(d:Drzava{naziv:'" + d.naziv + "'})").Return<Slika>("s").ResultsAsync;
            foreach (Slika s in slike_drzava)
            {
                listaSlika.Add(s);
            }
            //Slike iz regiona korisnika
            // Region r = (await _client.Cypher.Match("(k:Preference{ korisnicko_ime:'" + korisnicko_ime + "'})-[:Prefers_Region]->(r:Region)").Return(r => r.As<Region>()).ResultsAsync).FirstOrDefault();
            // var drzave = await _client.Cypher.Match("(r:Region{naziv:'" + r.naziv + "' })<-[:region_drzava]-(d:Drzava)").Return<Drzava>("d").ResultsAsync;
            // foreach (Drzava dr in drzave)
            // {
            //     if (dr.naziv != zemlja_korisnika)
            //     {
            //         var slike_region = await _client.Cypher.Match("(s:Slika)-[r:Veza]->(d:Drzava{naziv:'" + dr.naziv + "'})").Return<Slika>("s").ResultsAsync;
            //         foreach (Slika s in slike_region)
            //         {
            //             listaSlika.Add(s);
            //         }
            //     }
            // }
            //Slika iz tagova korisnika
            var tagovi = await _client.Cypher.Match("(k:Preference{ korisnicko_ime:'" + korisnicko_ime + "'})-[:Has_tag]->(t:Tag)").Return<Tag>("t").ResultsAsync;
            foreach (Tag tag in tagovi)
            {
                var slike = await _client.Cypher.Match("(s:Slika)-[:Has_tag]->(t:Tag{naziv:'" + tag.naziv + "'})").Return<Slika>("s").ResultsAsync;
                foreach (Slika s in slike)
                {

                    listaSlika.Add(s);
                }
            }
            //Slika iz followera
            var followers = await _client.Cypher.Match("(k:Korisnik{ korisnicko_ime:'" + korisnicko_ime + "'})-[:Follow]->(u:Korisnik)").Return<Korisnik>("u").ResultsAsync;
            foreach (Korisnik korisnik in followers)
            {
                var slike = await _client.Cypher.Match("(s:Slika)<-[:Posted]-(k:Korisnik)").Return<Slika>("s").ResultsAsync;
                foreach (Slika s in slike)
                {
                    listaSlika.Add(s);
                }

            }

            listaSlika = listaSlika.GroupBy(x => new { x.broj_lajkova, x.broj_komentara, x.lokacija }).Select(x => x.FirstOrDefault()).ToList();
            return listaSlika;
        }
        [HttpGet("VratiKomentare/{lokacija}")]
        public async Task<List<Komentar>> VratiKomentare(string lokacija)
        {
            if (string.IsNullOrEmpty(lokacija))
                return null;
            string s=lokacija.Replace("$@$", "\\");
            List<Komentar> listaKomentara = new List<Komentar>();
            var komentari = await _client.Cypher.Match("(u:Korisnik )-[r:Commented]->(s:Slika {lokacija:\'" + s + "\'})").Return<Komentar>("r").ResultsAsync;
            var korisnici = await _client.Cypher.Match("(u:Korisnik )-[r:Commented]->(s:Slika {lokacija:\'" + s + "\'})").Return<Korisnik>("u").ResultsAsync;
            List<Korisnik> listaKorisnika = new List<Korisnik>();
            foreach(Korisnik k in korisnici)
            {
                listaKorisnika.Add(k);
            }
            var i = 0;
            foreach (Komentar k in komentari)
            {
                Komentar k1 = new Komentar();
                k1.tekst = k.tekst;
                k1.salje = listaKorisnika[i++];
                listaKomentara.Add(k1);
            }
            return listaKomentara;
        }
        [HttpGet("VratiLajkove/{lokacija}")]
        public async Task<List<Like>> VratiLajkove(string lokacija)
        {
            if (string.IsNullOrEmpty(lokacija))
                return null;
            string s2=lokacija.Replace("$@$", "\\");
            List<Like> listaLajkova = new List<Like>();
            var korisnici = await _client.Cypher.Match("(u:Korisnik )-[r:Liked]->(s:Slika {lokacija:\'" + s2 + "\'})").Return<Korisnik>("u").ResultsAsync;
            List<Korisnik> listaKorisnika = new List<Korisnik>();
            foreach (Korisnik k in korisnici)
            {
                Like l = new Like();
                l.salje = k;
                listaLajkova.Add(l);
            }
            return listaLajkova;
        }
        [HttpGet("VratiFollowing/{korisnicko_ime}")]
        public async Task<List<Korisnik>> VratiFollowing(string korisnicko_ime)
        {
            if (string.IsNullOrEmpty(korisnicko_ime))
                return null;
            List<Korisnik> listaKorisnika = new List<Korisnik>();
            var korisnici = await _client.Cypher.Match("(u:Korisnik{korisnicko_ime:\'"+korisnicko_ime+"\'} )-[r:Follow]->(n:Korisnik)").Return<Korisnik>("n").ResultsAsync;
            foreach (Korisnik k in korisnici)
            {
                listaKorisnika.Add(k);
            }
            return listaKorisnika;
        }

        [HttpGet("VratiFollowere/{korisnicko_ime}")]
        public async Task<List<Korisnik>> VratiFollowere(string korisnicko_ime)
        {
            if (string.IsNullOrEmpty(korisnicko_ime))
                return null;
            List<Korisnik> listaKorisnika = new List<Korisnik>();
            var korisnici = await _client.Cypher.Match("(u:Korisnik)-[r:Follow]->(n:Korisnik{korisnicko_ime:\'" + korisnicko_ime + "\'} )").Return<Korisnik>("u").ResultsAsync;
            foreach (Korisnik k in korisnici)
            {
                listaKorisnika.Add(k);
            }
            return listaKorisnika;
        }

        [HttpGet("VratiMention/{korisnicko_ime}")]
         public async Task<List<Mentions>> VratiMention(string korisnicko_ime)
        {
            if (string.IsNullOrEmpty(korisnicko_ime))
                return null;
            List<Mentions> listaMentiona = new List<Mentions>();
            var mention = await _client.Cypher.Match("(u:Mention)-[r:Pomenut]->(n:Korisnik{korisnicko_ime:'" + korisnicko_ime + "'} )").Return((u)=>u.As<Mentions>()).ResultsAsync;
            foreach (Mentions m in mention)
            {
                Mentions men = new Mentions();
                var s=m.slika.Replace("$@$","\\");
                men.slika = s;
                men.salje = m.salje;
                men.prima = m.prima;
                listaMentiona.Add(men);
            } 
            return listaMentiona;
        }
        public static Guid Generate()
        {
            return Guid.NewGuid();
        }
    }
}
