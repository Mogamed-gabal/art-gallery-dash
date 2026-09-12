import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base.service';
import { ClientRequest } from '../models/domain.models';

@Injectable({ providedIn: 'root' })
export class ClientRequestsApiService extends HttpBaseService {
  list() {
    return this.get<ClientRequest[]>('/client-requests');
  }
}
