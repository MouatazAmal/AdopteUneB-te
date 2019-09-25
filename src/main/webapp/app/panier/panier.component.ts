import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Animaux, IAnimaux} from 'app/shared/model/animaux.model';
import {PanierService} from "app/panier/panier.service";
import {AnimalStatut} from "app/shared/model/enumerations/animal-statut.model";
import {AnimauxService} from "app/entities/animaux/animaux.service";

@Component({
  selector: 'jhi-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.scss']
})
export class PanierComponent implements OnInit {
  articles: Animaux[];
  id: number;
  totalPrice = 0;

  constructor(private route: ActivatedRoute, private router: Router, protected panierService : PanierService, protected animauxService:AnimauxService) {}

  ngOnInit() {
    this.id = +(this.route.snapshot.queryParamMap.get('id'));
    this.getResult();
  }

  removeProduct(animal:Animaux){
    animal.statut=AnimalStatut.DISPONIBLE;
    this.panierService.supAnimaux(animal.id);
    this.animauxService.updateStatut(animal);
    this.getResult();
  }

  toOrder(){
    this.router.navigate(['../payment']);
  }

  getResult() {
    this.articles= this.panierService.animauxes;
    this.setTotalPrice();
  }

  setTotalPrice(){
    this.totalPrice = 0;
    for(let i=0; i<this.articles.length; i++){
      this.totalPrice += this.articles[i].prix;
    }

  }

}
