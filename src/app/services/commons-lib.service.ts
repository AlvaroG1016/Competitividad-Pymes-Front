import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, Subject, lastValueFrom } from 'rxjs';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatProgressSpinner } from '@angular/material/progress-spinner'; // ← Agregar este import
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

  /* PETICIONES HTTP - SIN CAMBIOS */
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
    this.showSpinner(); // ← Mostrar spinner
    
    this.post<T>(url, body).subscribe({
      next: (res: any) => {
        this.hideSpinner(); // ← Ocultar spinner
        
        if (res.Ok === false && res.Error?.length && res.ValidationErrors?.length == 0) {
          onError?.(res.Error);
        } else if (res.Ok === false && res.ValidationErrors?.length > 0) {

          onValidationError?.(res.ValidationErrors);
        } else {
          onSuccess(res);
        }
      },
      error: (err) => {
        this.hideSpinner(); // ← Ocultar spinner
        
        const failure = err.error;

        
        if (err.error?.ValidationErrors?.length) {
          onValidationError?.([`${failure.Error ? failure.Error : err.error.ValidationErrors}`]);
        } else if (err.error?.Error?.length) {
          onError?.([`Error del servidor: ${failure.Error ? failure.Error : err.error.Error}`]);
        } else {
          const errorDetails = Object.entries(err.error.errors || {})
            .map(([key, value]) => `${value}`)
            .join(', ');
          error?.([`Error del servidor: ${errorDetails}`]);
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
    this.showSpinner(); // ← Mostrar spinner
    
    this.edit<T>(url, id, body).subscribe({
      next: (res: any) => {
        this.hideSpinner(); // ← Ocultar spinner
        
        if (res.Ok === false && res.Error?.length && res.ValidationErrors?.length == 0) {
          onError?.(res.Error);
        } else if (res.Ok === false && res.ValidationErrors?.length) {

          onValidationError?.(res.ValidationErrors);
        } else {
          onSuccess(res);
        }
      },
      error: (err) => {
        this.hideSpinner(); // ← Ocultar spinner
        

        if (err.error?.ValidationErrors?.length) {
          onValidationError?.([`Error del servidor: ${err.error.ValidationErrors}`]);
        } else if (err.error?.Error?.length) {
          onError?.([`Error del servidor: ${err.error.Error}`]);
        } else {
          const errorDetails = Object.entries(err.error.errors || {})
            .map(([key, value]) => `${value}`)
            .join(', ');
          error?.([`Error del servidor: ${errorDetails}`]);
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
    this.showSpinner(); // ← Mostrar spinner

    this.getById<T>(url, id).subscribe({
      next: (res: any) => {
        this.hideSpinner(); // ← Ocultar spinner
        
        if (res.Ok === false && res.Error?.length && res.ValidationErrors?.length == 0) {
          onError?.(res.Error);
        } else if (res.Ok === false && res.ValidationErrors?.length) {

          onValidationError?.(res.ValidationErrors);
        } else {
          onSuccess(res);
        }
      },
      error: (err) => {
        this.hideSpinner(); // ← Ocultar spinner
        

        if (err.error?.ValidationErrors?.length) {
          onValidationError?.([`Error del servidor: ${err.error.ValidationErrors}`]);
        } else if (err.error?.Error?.length) {
          onError?.([`Error del servidor: ${err.error.Error}`]);
        }
      },
    });
  }

  getWithHandling<T>(
  url: string,
  onSuccess: (response: T) => void,
  onValidationError?: (errors: string[]) => void,
  onError?: (errors: string[]) => void
): void {
  this.showSpinner(); // ← Mostrar spinner

  this.get<T>(url).subscribe({
    next: (res: any) => {
      this.hideSpinner(); // ← Ocultar spinner
      
      if (res.Ok === false && res.Error?.length && res.ValidationErrors?.length == 0) {
        onError?.(res.Error);
      } else if (res.Ok === false && res.ValidationErrors?.length) {

        onValidationError?.(res.ValidationErrors);
      } else {
        onSuccess(res);
      }
    },
    error: (err) => {
      this.hideSpinner(); // ← Ocultar spinner
      

      if (err.error?.ValidationErrors?.length) {
        onValidationError?.([`Error del servidor: ${err.error.ValidationErrors}`]);
      } else if (err.error?.Error?.length) {
        onError?.([`Error del servidor: ${err.error.Error}`]);
      } else {
        // Fallback para errores no estructurados
        onError?.([`Error de conexión: ${err.message || 'Error desconocido'}`]);
      }
    },
  });
}

  /* -------- SPINNER CON MATERIAL - SÚPER SIMPLE ------------- */
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

      // Usar el spinner de Material
      const spinnerPortal = new ComponentPortal(MatProgressSpinner);
      const spinnerRef = this.overlayRef.attach(spinnerPortal);
      
      // Configurar el spinner
      spinnerRef.instance.diameter = 50;
      spinnerRef.instance.mode = 'indeterminate';
      spinnerRef.instance.color = 'primary';
    }
  }

  hideSpinner() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = null;
    }
  }

  /* RESTO DE MÉTODOS SIN CAMBIOS... */
  
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

  descargarArchivo(data: any): void {
    if (!data || !data.FileContent || !data.FileName) {

      alert('Ocurrió un error al descargar el archivo.');
      return;
    }

    const fileContent = data.FileContent;
    const fileName = data.FileName;

    const byteCharacters = atob(fileContent);
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

  exportarExcel(serverDataReport: any, columnas: any, dialog?: any) {
    var serverMethod = serverDataReport.join('/');

    this.postWithHandling(
      serverMethod,
      { paginate: false, draw: 0, columns: columnas },
      (res: any) => {
        this.descargarArchivo(res.Data);
      },
      (validationErrors) => {
        // Manejar errores de validación
      },
      (generalErrors) => {
        // Manejar errores generales
      }
    );
  }

  createEntity(serverData: string[], requestBody, dialog, response?) {
    const serverMethod = serverData.join('/');
    
    this.postWithHandling(
      serverMethod,
      requestBody,
      (res) => {
        response?.emit(res);
      },
      (validationErrors) => {
        // Manejar errores de validación
      },
      (generalErrors) => {
        // Manejar errores generales
      },
      (error) => {
        // Manejar errores
      }
    );
  }

  openResultModal(
    dialog: MatDialog,
    isSuccess: boolean,
    validationErrors?: string[],
    generalErrors?: string[],
    isCreate?: boolean,
    isDelete?: boolean,
    customLabel?: string
  ) {
    let message = '';
    let accion = isCreate ? 'creado' : isDelete ? 'eliminado' : 'editado';
    
    if (isSuccess) {
      if (customLabel) {
        message = customLabel;
      } else {
        message = `El elemento fue ${accion} correctamente.`;
      }
    } else {
      if (validationErrors && validationErrors.length > 0) {
        message = `Hubo un error:\n\n${validationErrors.join('\n')}`;
      } else if (generalErrors && generalErrors.length) {
        message = `Hubo un error:\n\n${generalErrors.join('\n')}`;
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

  // Resto de métodos sin cambios (copio solo algunos importantes)
  private handleError(error: any): void {
    if (error instanceof ErrorEvent) {

    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
  }

  // ... resto de métodos igual que antes
}