import { Korisnik } from "./korisnik"
import { Slika } from "./slika"

export interface Komentar{
    tekst:string
    salje:Korisnik
    slika:Slika
}