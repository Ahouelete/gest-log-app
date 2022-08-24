import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvancePourMarcheComponent } from './components/avance-pour-marche/avance-pour-marche.component';
import { CategorieArticleComponent } from './components/categorie-article/categorie-article.component';
import { ChantierComponent } from './components/chantier/chantier.component';
import { ClientComponent } from './components/client/client.component';
import { ContratSousTraitantComponent } from './components/contrat-sous-traitant/contrat-sous-traitant.component';
import { DaoComponent } from './components/dao/dao.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FamilleArticleComponent } from './components/famille-article/famille-article.component';
import { FournisseurComponent } from './components/fournisseur/fournisseur.component';
import { ListFactureMarchesComponent } from './components/list-facture-marches/list-facture-marches.component';
import { ListReglementFactureMarcheComponent } from './components/list-reglement-facture-marche/list-reglement-facture-marche.component';
import { LoginComponent } from './components/login/login.component';
import { MarcheComponent } from './components/marche/marche.component';
import { ParametreSocieteComponent } from './components/parametre-societe/parametre-societe.component';
import { ProfilUserComponent } from './components/profil-user/profil-user.component';
import { SousTraitantComponent } from './components/sous-traitant/sous-traitant.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'chantier', component: ChantierComponent},
  {path: 'avance-pour-marche', component: AvancePourMarcheComponent},
  {path: 'contrat-sous-traitant', component: ContratSousTraitantComponent},
  {path: 'client', component: ClientComponent},
  {path: 'profil', component: ProfilUserComponent},
  {path: 'parametre-societe', component: ParametreSocieteComponent},
  {path: 'sous-traitant', component: SousTraitantComponent},
  {path: 'fournisseur', component: FournisseurComponent},
  {path: 'list-reglement-facture-marche', component: ListReglementFactureMarcheComponent},
  {path: 'list-facture-marche' , component: ListFactureMarchesComponent},
  { path: 'dao', component: DaoComponent },
  { path: 'marche', component: MarcheComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'famille-article', component: FamilleArticleComponent },
  { path: 'categorie-article', component: CategorieArticleComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
