import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleItem } from 'app/article/article-items';
import { Animaux } from 'app/shared/model/animaux.model';
import {Paniers} from "app/shared/model/paniers.model";
import {PanierService} from "app/panier/panier.service";

@Component({
  selector: 'jhi-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.scss']
})
export class PanierComponent implements OnInit {
  articles: Animaux[];
  id: number;

  constructor(private route: ActivatedRoute, private router: Router, protected panierService : PanierService) {}

  ngOnInit() {
    this.id = +(this.route.snapshot.queryParamMap.get('id'));
    this.getResult();
  }

  removeProduct(id){
    this.panierService.supAnimaux(id);
    this.getResult();
  }

  toOrder(){
    this.router.navigate(['../payment']);
  }

  getResult() {
    this.articles= this.panierService.animauxes;
  }

}
