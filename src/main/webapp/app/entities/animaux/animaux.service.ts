import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {DATE_FORMAT, DATE_TIME_FORMAT} from 'app/shared/constants/input.constants';
import {catchError, map} from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import {Animaux, IAnimaux} from 'app/shared/model/animaux.model';
import {AnimalStatut} from "app/shared/model/enumerations/animal-statut.model";

type EntityResponseType = HttpResponse<Animaux>;
type EntityArrayResponseType = HttpResponse<Animaux[]>;

@Injectable({ providedIn: 'root' })
export class AnimauxService {
  public resourceUrl = SERVER_API_URL + 'api/animauxes';

  constructor(protected http: HttpClient) {}

  create(animaux: IAnimaux): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(animaux);
    return this.http
      .post<Animaux>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(animaux: IAnimaux): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(animaux);
    return this.http
      .put<Animaux>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  updateStatut(animaux: IAnimaux): Observable<EntityResponseType> {
    return this.http
      .put<Animaux>(this.resourceUrl, animaux,{ observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    ;
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<Animaux>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findAnimal(id: number): Observable<Animaux> {
    return this.http
      .get<Animaux>(`${this.resourceUrl}/${id}`);
  }

  filtre(sexeAnimal:string, type:string,prixMini: string, prixMaxi : string):Observable<any>{
    if(type==="") {
      return this.http
        .get(`${this.resourceUrl}`, {
          params: {
            sexe: sexeAnimal,
            prixMin: prixMini,
            prixMax: prixMaxi,
            animalStatut1: AnimalStatut.DISPONIBLE,
            animalStatut2: AnimalStatut.RESERVE
          }
        });
    }else{
      return this.http
        .get(`${this.resourceUrl}`, {
          params: {
            sexe: sexeAnimal,
            typeAnimal: type,
            prixMin: prixMini,
            prixMax: prixMaxi,
            animalStatut1: AnimalStatut.DISPONIBLE,
            animalStatut2: AnimalStatut.RESERVE
          }
        })
    }
  }

  findNewArrivals():Observable<any>{
    return this.http
      .get(`${this.resourceUrl}/${'new-arrivals'}`);
  }
  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Animaux[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(animaux: IAnimaux): IAnimaux {
    const copy: IAnimaux = Object.assign({}, animaux, {
      dateAjout: animaux.dateAjout != null && animaux.dateAjout.isValid() ? animaux.dateAjout.toJSON() : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateAjout = res.body.dateAjout != null ? moment(res.body.dateAjout) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((animaux: Animaux) => {
        animaux.dateAjout = animaux.dateAjout != null ? moment(animaux.dateAjout) : null;
      });
    }
    return res;
  }

  public createFromAnimalForm(animal:Animaux): IAnimaux {
    return {
      ...new Animaux(),
      id: animal.id,
      nom: animal.nom,
      age: animal.age,
      prix: animal.prix,
      description: animal.description,
      statut: animal.statut,
      typeAnimal: animal.typeAnimal,
      sexe: animal.sexe,
      poids: animal.poids,
      fertilite: animal.fertilite,
      dateAjout:
        animal.dateAjout != null ? moment(animal.dateAjout, DATE_TIME_FORMAT) : undefined,
      imageContentType: animal.imageContentType,
      image: animal.image,
      paniers: animal.paniers,
      commandes:animal.commandes
    };
  }
}
