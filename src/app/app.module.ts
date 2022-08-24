import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from './services/authService';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from './services/globalService';
import { HeaderComponent } from './components/header/header.component';
import { LeftMenuComponent } from './components/left-menu/left-menu.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FamilleArticleComponent } from './components/famille-article/famille-article.component';
import { CategorieArticleComponent} from './components/categorie-article/categorie-article.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { JwtInterceptor } from './services/jwtInterceptor';
import { CategorieService } from './services/categorieService';
import { AlertComponent } from './components/alert/alert.component';
import {MatDialogModule} from '@angular/material/dialog';
import { FamilleService } from './services/familleService';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DaoComponent } from './components/dao/dao.component';
import { DaoService } from './services/daoService';
import { MetaDonneeService } from './services/metaDonneeService';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { MarcheComponent } from './components/marche/marche.component';
import { MarcheService } from './services/marcheService';
import { ListFactureMarchesComponent } from './components/list-facture-marches/list-facture-marches.component';
import { FactureMarcheService } from './services/factureMarcheService';
import { ListReglementFactureMarcheComponent } from './components/list-reglement-facture-marche/list-reglement-facture-marche.component';
import { ModalReglementInvoiceMarcheComponent } from './components/modal-reglement-invoice-marche/modal-reglement-invoice-marche.component';
import { ReglementFactureMarcheService } from './services/reglementFactureMarche';
import { FournisseurComponent } from './components/fournisseur/fournisseur.component';
import { ClientComponent } from './components/client/client.component';
import { TiersService } from './services/tiersServices';
import { SousTraitantComponent } from './components/sous-traitant/sous-traitant.component';
import { ParametreSocieteComponent } from './components/parametre-societe/parametre-societe.component';
import { ProfilUserComponent } from './components/profil-user/profil-user.component';
import {MatTabsModule} from '@angular/material/tabs';
import { MECEFService } from './services/mecefService';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SocieteService } from './services/societeService';
import { ChantierComponent } from './components/chantier/chantier.component';
import { ContratSousTraitantComponent } from './components/contrat-sous-traitant/contrat-sous-traitant.component';
import { ContratSousTraitantService } from './services/contratSousTraitantService';
import { ChantierService } from './services/chantierService';
import {MatStepperModule} from '@angular/material/stepper';
import { AvancePourMarcheComponent } from './components/avance-pour-marche/avance-pour-marche.component';
import { PieceDaoService } from './services/pieceDaoService';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    LeftMenuComponent,
    DashboardComponent,
    FamilleArticleComponent,
    CategorieArticleComponent,
    AlertComponent,
    ConfirmDialogComponent,
    DaoComponent,
    MarcheComponent,
    ListFactureMarchesComponent,
    ListReglementFactureMarcheComponent,
    ModalReglementInvoiceMarcheComponent,
    FournisseurComponent,
    ClientComponent,
    SousTraitantComponent,
    ParametreSocieteComponent,
    ProfilUserComponent,
    ChantierComponent,
    ContratSousTraitantComponent,
    AvancePourMarcheComponent
  ],
  imports: [
    MatSelectModule,
    MatStepperModule,
    MatTabsModule,
    MatOptionModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  providers: [
    SocieteService,
    PieceDaoService,
    ContratSousTraitantService,
    ChantierService,
    TiersService,
    AuthService,
    MECEFService,
    CategorieService,
    FamilleService,
    DaoService,
    MetaDonneeService,
    MarcheService,
    FactureMarcheService,
    ReglementFactureMarcheService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    GlobalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
