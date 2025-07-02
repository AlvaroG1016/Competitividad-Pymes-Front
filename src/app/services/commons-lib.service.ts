import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, Subject, lastValueFrom } from 'rxjs';
/* import { DinamycFormModalComponent, ModalNotifyComponent } from '@commons-lib';
 *//* import { MatDialog } from '@angular/material/dialog';
 */import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
/* import { MatProgressSpinner, MatSpinner } from '@angular/material/progress-spinner';
 *//* import { SpinnerOverlayComponent } from './components/controls/spinner-overlay/spinner-overlay.component';
 */
 import { environment } from '../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ModalNotifyComponent } from '../components/modal-notify/modal-notify.component';

@Injectable({
  providedIn: 'root',
})
export class CommonsLibService {
  private config: any;
  private overlayRef: OverlayRef | null = null;
  private urlApi = environment.apiUrl;
  constructor(private http: HttpClient, private overlay: Overlay, private injector: Injector) {}

  /* PETICIONES HTTP */
  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(this.urlApi + url, body);
  }

  getById<T>(url: string, id: any): Observable<T> {
    return this.http.get<T>(this.urlApi + url + '?Id=' + id);
  }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(this.urlApi + url);
  }

  edit<T>(url: string, id: any, body: any): Observable<T> {
    return this.http.post<T>(this.urlApi + url + '?id=' + id, body);
  }

  postWithHandling<T>(
    url: string,
    body: any,
    onSuccess: (response: T) => void,
    onValidationError?: (errors: string[]) => void,
    onError?: (errors: string[]) => void,
    error?: (errors: string[]) => void
  ): void {
    this.showSpinner();
    this.post<T>(url, body).subscribe({
      next: (res: any) => {
        this.hideSpinner(); 
        if (
          res.Ok === false &&
          res.Error?.length &&
          res.ValidationErrors?.length == 0
        ) {
          
          onError?.(res.Error);
        } else if (res.Ok === false && res.ValidationErrors?.length > 0) {
          
          console.warn('Errores de validación:', res.ValidationErrors);
          onValidationError?.(res.ValidationErrors);
        } else {
          onSuccess(res);
        }
      },
      error: (err) => {
        this.hideSpinner();

        const failure = err.error;

        console.error('Error en la petición:', err);
        if (err.error?.ValidationErrors?.length) {
          
          onValidationError([
            `${failure.Error ? failure.Error : err.error.ValidationErrors}`,
          ]);
        }
        else if (err.error?.Error?.length) {
          
          onError([`Error del servidor: ${failure.Error ? failure.Error : err.error.Error}`]);
        } else {
          const errorDetails = Object.entries(err.error.errors)
            .map(([key, value]) => `${value}`)
            .join(', ');

          error([`Error del servidor: ${errorDetails}`]);
        }
      },
    });
  }

  editWithHandling<T>(
    url: string,
    id: any,
    body: any,
    onSuccess: (response: T) => void,
    onValidationError?: (errors: string[]) => void,
    onError?: (errors: string[]) => void,
    error?: (errors: string[]) => void
  ): void {
    this.showSpinner();
    this.edit<T>(url, id, body).subscribe({
      next: (res: any) => {
        this.hideSpinner(); 

        if (
          res.Ok === false &&
          res.Error?.length &&
          res.ValidationErrors?.length == 0
        ) {
          onError?.(res.Error);
        } else if (res.Ok === false && res.ValidationErrors?.length) {
          console.warn('Errores de validación:', res.ValidationErrors);
          onValidationError?.(res.ValidationErrors);
        } else {
          onSuccess(res);
        }
      },
      error: (err) => {
        this.hideSpinner(); 
        console.error('Error en la petición:', err);
        if (err.error?.ValidationErrors?.length) {
          onValidationError([
            `Error del servidor: ${err.error.ValidationErrors}`,
          ]);
        }
        if (err.error?.Error?.length) {
          onError([`Error del servidor: ${err.error.Error}`]);
        } else {
          const errorDetails = Object.entries(err.error.errors)
            .map(([key, value]) => `${value}`)
            .join(', ');

          error([`Error del servidor: ${errorDetails}`]);
        }
      },
    });
  }

  getByIdWithHandling<T>(
    url: string,
    id: any,
    onSuccess: (response: T) => void,
    onValidationError?: (errors: string[]) => void,
    onError?: (errors: string[]) => void
  ): void {
    this.showSpinner();

    this.getById<T>(url, id).subscribe({
      next: (res: any) => {
        this.hideSpinner(); 
        if (
          res.Ok === false &&
          res.Error?.length &&
          res.ValidationErrors?.length == 0
        ) {
          onError?.(res.Error);
        } else if (res.Ok === false && res.ValidationErrors?.length) {
          console.warn('Errores de validación:', res.ValidationErrors);
          onValidationError?.(res.ValidationErrors);
        } else {
          onSuccess(res);
        }
      },
      error: (err) => {
        
        console.error('Error en la petición:', err);
        if (err.error?.ValidationErrors?.length) {
          
          onValidationError([
            `Error del servidor: ${err.error.ValidationErrors}`,
          ]);
        }
        if (err.error?.Error?.length) {
          
          onError([`Error del servidor: ${err.error.Error}`]);
        }
      },
    });
  }

  getAll(resource: string, apiurl: string): Observable<any> {
    try {
      const data = this.http.get<any>(`${apiurl}${resource}`);
      return data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async create(resource: string, apiurl: string, data: any): Promise<any> {
    try {
      const createdItem = await lastValueFrom(
        this.http.post<any>(`${apiurl}${resource}`, data)
      );
      return createdItem;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  /* FIN PETICIONES HTTP  */

/* Descarga Archivos */

 descargarArchivo(data: any): void {
  if (!data || !data.FileContent || !data.FileName) {
    console.error('Datos del archivo no válidos:', data);
    alert('Ocurrió un error al descargar el archivo.');
    return;
  }

  const fileContent = data.FileContent;
  const fileName = data.FileName;

  const byteCharacters = atob(fileContent); // Decodificar Base64
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName; 
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url); 
  document.body.removeChild(a);
}



exportarExcel(serverDataReport:any, columnas:any, dialog?:any){
  var serverMethod = serverDataReport.join('/');
  
  this.postWithHandling(
    serverMethod,
     {paginate:false, draw:0, columns:columnas},
    (res:any) => {
      this.descargarArchivo(res.Data);
    },
    (validationErrors) => {
      // Manejar errores de validación
      //this.openResultModal(dialog, false, validationErrors, null, true);
    },
    (generalErrors) => {
      // Manejar errores generales
      //this.openResultModal(dialog, false, null, generalErrors, true);
    }
  );
}

/* FIN Descarga Archivos */


  /* Entidades */

  createEntity(
    serverData: string[],
    requestBody,
    dialog,
    //dtInstance: DataTables.Api,
    response?
  ) {
    const serverMethod = serverData.join('/');
    debugger;
    this.showSpinner();

    this.postWithHandling(
      serverMethod,
      requestBody,
      (res) => {
        this.hideSpinner(); 
        response.emit(res);
       // this.reloadDataTable(dtInstance);
        //this.openResultModal(dialog, true, null, null, true);
      },
      (validationErrors) => {
        this.hideSpinner(); 
        //this.openResultModal(dialog, false, validationErrors, null, true);
      },
      (generalErrors) => {
        this.hideSpinner(); 
        //this.openResultModal(dialog, false, null, generalErrors, true);
      },
      (error) => {
        this.hideSpinner(); 
        //this.openResultModal(dialog, false, null, error);
      }
    );
  }

  /* deleteEntity(
    serverData: string,
    dialog,
    //dtInstance?: DataTables.Api,
    requestBody?,
    response?
  ) {
    this.openConfirmationModal(
      dialog,
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este elemento?',
      () => {
        this.showSpinner();

        this.postWithHandling(
          serverData,
          null,
          (res) => {
            this.hideSpinner(); 
            if(response)
            {
              response.emit(res);
            }
 */
            /* if(dtInstance)
            {
              this.reloadDataTable(dtInstance);
            }
             */
           /*  this.openResultModal(dialog, true, null, null, false, true);
          },
          (validationErrors) => {
            this.hideSpinner(); 
            this.openResultModal(
              dialog,
              false,
              validationErrors,
              null,
              false,
              true
            );
          },
          (generalErrors) => {
            this.hideSpinner(); 
            this.openResultModal(
              dialog,
              false,
              null,
              generalErrors,
              false,
              true
            );
          },
          (error) => {
            this.hideSpinner(); 
            this.openResultModal(dialog, false, null, error);
          }
        );
      }
    );
  } */

  //Cargar los datos de la entidad a editar

  loadEditEntity(
    urlGet: string,
    id: any,
    formFields,
    dialog,
    serverData: string[],
    //dtInstance: DataTables.Api
  ) {
    this.showSpinner();

    this.getByIdWithHandling(urlGet, id, (res: any) => {
      this.hideSpinner(); 
      const updatedFields = formFields.map((field) => {
        const isAsyncSelectSearch =
          field.typeComponent === 'async-select' && field.mode === 'search';
        const isAsyncSelectPreloadNoService =
          field.typeComponent === 'async-select' &&
          field.mode === 'preload' &&
          !field.serviceValue;
        const isAsyncSelectPreloadWithService =
          field.typeComponent === 'async-select' &&
          field.mode === 'preload' &&
          field.serviceValue;
        const isMultiCheckbox = field.typeComponent === 'multi-checkbox';
  
        if (isAsyncSelectSearch || isAsyncSelectPreloadNoService) {
          return {
            ...field,
            initialValue: res.Data[field.labelKey] || '',
          };
        }
  
        if (isAsyncSelectPreloadWithService || isMultiCheckbox) {
          return {
            ...field,
            initialValue: res.Data[field.serviceValue] || '',
          };
        }
  
        if (field.outmodel) {
          return {
            ...field,
          };
        }
  
        return {
          ...field,
          value: res.Data[field.name] || null,
        };
      });
  
      /* const dialogRef = dialog.open(DinamycFormModalComponent, {
        data: {
          title: 'Editar',
          fields: updatedFields,
          cols:
            updatedFields.length < 3
              ? updatedFields.length === 2
                ? 4
                : 2
              : 6,
        },
        width:
          updatedFields.length < 3
            ? updatedFields.length === 2
              ? '33%'
              : '18%'
            : '50%',
      }); */
  
      /* dialogRef.afterClosed().subscribe((result) => {
        if (result?.confirmed) {
          this.editEntity(serverData, result.data, dialog, id, dtInstance);
        }
      }); */
    });
  }
  

  editEntity(
    serverData: string[],
    requestBody,
    dialog,
    id,
    //dtInstance: DataTables.Api,
    response?
  ) {
    const serverMethod = serverData.join('/');
    this.showSpinner();

    this.editWithHandling(
      serverMethod,
      id,
      requestBody,
      (res) => {
        this.hideSpinner(); 
        if (response) {
          response.emit(res);
        }
        //this.reloadDataTable(dtInstance);
        //this.openResultModal(dialog, true);
      },
      (validationErrors) => {
        this.hideSpinner(); 
        //this.openResultModal(dialog, false, validationErrors);
      },
      (generalErrors) => {
        this.hideSpinner(); 
       // this.openResultModal(dialog, false, null, generalErrors);
      },
      (error) => {
        this.hideSpinner(); 
        //this.openResultModal(dialog, false, null, error);
      }
    );
  }

  /* Fin Entidades */

  /* Datatable */

/*   reloadDataTable(dtInstance: DataTables.Api): void {
    dtInstance.ajax.reload(null, false);
  } */


  booleanColumnRenderer = (data: any, type: any, row: any, meta: any) => {
    if (type === 'display') {
      return `<input type="checkbox" disabled ${data ? 'checked' : ''}>`;
    }
    return data;
  };

  private dataTableRequestSource = new BehaviorSubject<any>(null);
  public dataTableRequest$ = this.dataTableRequestSource.asObservable();

  // Método para actualizar el DataTableRequest
  updateDataTableRequest(request: any): void {
    this.dataTableRequestSource.next(request);
  }

  // Método para obtener el último DataTableRequest
  getCurrentDataTableRequest(): any {
    return this.dataTableRequestSource.value;
  }

  /*  */

  /* Modal de notificacion Reutilizable  */
  openResultModal(
    dialog: MatDialog,
    isSuccess: boolean,
    validationErrors?: string[],
    generalErrors?: string[],
    isCreate?: boolean,
    isDelete?: boolean,
    customLabel?:string
  ) {
    let message = '';
    let accion = isCreate ? 'creado' : isDelete ? 'eliminado' : 'editado';
    if (isSuccess) {
      if (customLabel) {
        message = customLabel;
      }else{

        message = `El elemento fue ${accion} correctamente.`;
      }
    } else {
      if (validationErrors && validationErrors.length > 0) {
        message = `Hubo un error:\n\n${validationErrors.join('\n')}`;
      } else if (generalErrors && generalErrors.length) {
        message = `Hubo un error:\n\n${generalErrors.concat('\n')}`;
      } else {
        message = 'Hubo un error inesperado.';
      }
    }

     const dialogRef = dialog.open(ModalNotifyComponent, {
      data: {
        title: isSuccess ? 'Éxito' : 'Error',
        message,
        buttonLabel: 'Aceptar',
        type: isSuccess ? 'success' : 'error',
      },
    });

    dialogRef.afterClosed().subscribe(() => {}); 
  }

  openConfirmationModal(
    //dialog: MatDialog,
    title: string,
    message: string,
    onConfirm: () => void
  ): void {
    /* const dialogRef = dialog.open(ModalNotifyComponent, {
      data: {
        title,
        message,
        buttonLabel: 'Aceptar',
        cancelLabel: 'Cancelar',
        type: 'warning',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        onConfirm();
      }
    }); */
  }

  /* Fin Modal notificacion  */

  /* Cargar configuracion de variables globales en remotos */
  loadConfig(): Promise<void> {
    return fetch('/assets/config.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not load configuration file.');
        }
        return response.json();
      })
      .then((data) => {
        this.config = data;
        console.log('Configuración cargada:', this.config);
      })
      .catch((error) => {
        console.error('Error loading configuration:', error);
      });
  }
  /*  */

  getConfig(key: string) {
    console.log('Configuración actual:', this.config);
    return this.config ? this.config[key] : null;
  }

  getParamValue(paramName)
  {
      var url = window.location.search.substring(1); //get rid of "?" in querystring
      var qArray = url.split('&'); //get key-value pairs
      for (var i = 0; i < qArray.length; i++) 
      {
          var pArr = qArray[i].split('='); //split key and value
          if (pArr[0] == paramName) 
              return pArr[1]; //return value
      }
      return null;
  }

  inicializarVariablesGlobales(AppData, ConfigData) {
    
    AppData.API_KEY = ConfigData.API_KEY;
    //urlApi = ConfigData.API_URL;
    AppData.localStorageToken = ConfigData.localStorageToken;
  }

  // Manejo de errores
  private handleError(error: any): void {
    if (error instanceof ErrorEvent) {
      console.error('An error occurred:', error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
  }

  private showModalSubject = new Subject<{
    titulo: string;
    descripcion: string;
    modalNotifyType: any;
    isDelete: boolean;
  }>();

  showModal$ = this.showModalSubject.asObservable();

  triggerShowModal(
    titulo: string,
    descripcion: string,
    modalNotifyType: any,
    isDelete: boolean
  ) {
    this.showModalSubject.next({
      titulo,
      descripcion,
      modalNotifyType,
      isDelete,
    });
  }

  private formsState: {
    [idTab: string]: { formularios: { [formId: string]: any } };
  } = {};
  private activeTabSubject = new BehaviorSubject<string | null>(null);
  activeTab$ = this.activeTabSubject.asObservable();

  private lastActiveTab: string | null = null;

  setActiveTabId(idTab: string): void {
    this.lastActiveTab = this.activeTabSubject.value;
    this.activeTabSubject.next(idTab);
  }

  getActiveTabId(): string | null {
    return this.activeTabSubject.value;
  }

  getOrCreateTabState(idTab: string): void {
    if (!this.formsState[idTab]) {
      this.formsState[idTab] = { formularios: {} };
    }
  }

  saveFormState(idTab: string, formId: string, formData: any): void {
    console.log(this.formsState);

    this.getOrCreateTabState(idTab);
    this.formsState[idTab].formularios[formId] = formData;
  }

  getFormState(idTab: string, formId: string): any | null {
    return this.formsState[idTab]?.formularios[formId] ?? null;
  }

  clearTabState(idTab: string): void {
    delete this.formsState[idTab];
  }

  clearAllFormsState(): void {
    this.formsState = {};
  }

  getLastActiveTab(): string | null {
    return this.lastActiveTab;
  }

  /* NOTIFICACION IDFORM O IDTAB AL ORQUESTADOR */
  private tabIdSubject = new Subject<string>();

  tabId$ = this.tabIdSubject.asObservable();

  notifyTabId(tabId: string): void {
    this.tabIdSubject.next(tabId);
  }


  private userNameSource = new BehaviorSubject<string | null>(null);
  private userRoleSource = new BehaviorSubject<string | null>(null);

  userName$ = this.userNameSource.asObservable();
  userRole$ = this.userRoleSource.asObservable();

  setUserName(userName: string): void {
    this.userNameSource.next(userName);
    localStorage.setItem('userName', userName);
  }
  
  setUserRole(userRole: string): void {
    this.userRoleSource.next(userRole);
    localStorage.setItem('userRole', userRole);
  }
 
  /* Menu */
  ListaMenuOrden(id:any): Observable<any> {
    return this.get<any>(`Menu/ListaMenuByIdPlanOrden?Id=${id}`);
  }

  getIdSuscripcion() {
    let id = localStorage.getItem('IdSuscripcion');
    return id;
  }
  getIdTipoPlan() {
    let id = localStorage.getItem('IdTipoPlan');
    return id;
  }

  ObtenerMenusSeleccionados(idRoL: number): Observable<any> {
    return this.http.get<any>(
      `${this.urlApi}Rol/GetIdsMenuByIdRol?Id=${idRoL}`
    );
  }

  private controlchange: EventEmitter<any> = new EventEmitter();
  private controlSetValue: EventEmitter<any> = new EventEmitter();
  private controlSetRequired: EventEmitter<any> = new EventEmitter();
  private controlSetHidden: EventEmitter<any> = new EventEmitter();
  private cancelButtonModal: EventEmitter<any> = new EventEmitter();
  private saveButtonModal: EventEmitter<any> = new EventEmitter();
  private cascadeListElement: EventEmitter<any> = new EventEmitter();

  emitControlChangeEvent(item: any, controlName: string, data: any = null) {
    this.controlchange.emit({
      item: item,
      controlName: controlName,
      data: data,
    });
  }

  getControlChangeEmitter() {
    return this.controlchange;
  }
  
  emitSetValueFieldEvent(controlName: string, data: any = null) {
    this.controlSetValue.emit({ controlName: controlName, data: data });
  }

  getValueFieldEmitter() {
    return this.controlSetValue;
  }

  emitSetRequiredFieldEvent(controlName: object, required: boolean) {
    this.controlSetRequired.emit({ controlName: controlName, data: required });
  }

  getRequiredFieldEmitter() {
    return this.controlSetRequired;
  }
  
  emitSetHiddenFieldEvent(controlName: object, hidden: boolean) {
    this.controlSetHidden.emit({ controlName: controlName, data: hidden });
  }

  getHiddenFieldEmitter() {
    return this.controlSetHidden;
  }

  emitcancelClickModalEvent() {
    this.cancelButtonModal.emit();
  }

  getCancelClickModalEmitter() {
    return this.cancelButtonModal;
  }

  emitsaveClickModalEvent() {
    this.saveButtonModal.emit();
  }

  getSaveClickModalEmitter() {
    return this.saveButtonModal;
  }

  emitcascadeListElementEvent(
    controlName: string,
    classField: string,
    filterId: number
  ) {
    this.cascadeListElement.emit({
      controlName: controlName,
      classField: classField,
      data: filterId,
    });
  }

  getcascadeListElementEmitter() {
    return this.cascadeListElement;
  }


 /* -------- SPINNER ------------- */
 // Método para mostrar el spinner
 showSpinner() {
  if (!this.overlayRef) {
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'dark-backdrop',
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
    });

    //const spinnerPortal = new ComponentPortal(SpinnerOverlayComponent);
    //this.overlayRef.attach(spinnerPortal);
  }
}

hideSpinner() {
  if (this.overlayRef) {
    this.overlayRef.detach();
    this.overlayRef = null;
  }
}
}
